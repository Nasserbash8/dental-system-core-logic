'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Box } from "@mui/material";
import FileUpload from "react-material-file-upload";
import Modal from '../ui/modal';
import { Plus } from "lucide-react";
import Button from "../ui/button/Button";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Captions from "yet-another-react-lightbox/plugins/captions";

type Image = {
  _id: string;
  src: string;
  date: string | Date;
};

type Props = {
  patient: {
    patientId: string; // for API
    images: Image[];
  };
};

export default function UserImages({ patient }: Props) {
  const [images, setImages] = useState<Image[]>(patient.images || []);
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [index, setIndex] = useState<number>(-1); // لإدارة Lightbox

  // تحويل صور API لهيئة مطلوبة لـ react-photo-album و Lightbox
  const photos = images.map(img => ({
    src: img.src,
   width: 800,     // يمكنك تحديد حجم افتراضي ثابت أو حساب الحجم الديناميكي
  height: 600,
    id: img._id,
  }));

  // حذف صورة
// handleDelete: حذف صورة واحدة فوراً
const handleDelete = async (id: string) => {
  // إزالة الصورة من الواجهة فوراً
  setImages((prev) => prev.filter((img) => img._id !== id));

  try {
    const response = await fetch(`/api/patients/${patient.patientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleteImageIds: [id] }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "فشل حذف الصورة");
  } catch (error) {
    console.error("حدث خطأ أثناء حذف الصورة:", error);
    // يمكنك هنا إعادة إضافة الصورة للحالة إذا أردت أو عرض رسالة خطأ
  }
};

// handleSave: رفع الصور الجديدة فقط عند الحفظ في المودال
const handleSave = async () => {
  if (isSaving) return;
  setIsSaving(true);

  try {
    const formData = new FormData();

    // أضف ملفات الصور الجديدة فقط
    uploadImages.forEach((file) => {
      formData.append('newImages', file);
    });

    const res = await fetch(`/api/patients/${patient.patientId}`, {
      method: 'PATCH',
      body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "فشل رفع الصور");

    // حدّث حالة الصور بالصور الجديدة من السيرفر
    setImages(data.data.images || []);
    setUploadImages([]);
    setIsModalOpen(false);
  } catch (error) {
    console.error("حدث خطأ أثناء حفظ الصور:", error);
  } finally {
    setIsSaving(false);
  }
};


  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">صور المريض</h2>

          <div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={img._id} className="relative group cursor-pointer">
            <img
              src={img.src}
              alt=""
              onClick={() => setIndex(i)}
              className="w-full md:h-50 h-25 object-cover rounded-md"
            />
            <button
              onClick={() => handleDelete(img._id)}
              className="absolute top-1 right-1 bg-red-500 bg-opacity-60 text-white rounded-full w-6 h-6 text-sm hidden group-hover:block"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <Lightbox
slides={images.map((img) => ({
  src: img.src,
  width: 1200,
  height: 800,
  description: img.date
      ? `تم الرفع في: ${new Date(img.date).toLocaleDateString("ar-EG", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "تاريخ غير متوفر",
}))}

       open={index >= 0}
  index={index}
  close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom , Captions]}
         carousel={{ finite: true }}
      />
    </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex text-sm items-center gap-2 px-4 py-2 mt-5 text-white bg-brand-600 rounded hover:bg-gray-700"
        >
          <Plus className="w-4 h-4" />
          إضافة صور جديدة / تعديل الصور
        </button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isFullscreen>
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-4">إضافة أو حذف صور</h4>

            <Box className="mt-4">
              <Typography className="mb-2 font-semibold">رفع صور جديدة</Typography>
              <FileUpload
                value={uploadImages}
                onChange={setUploadImages}
                title="اسحب الصور هنا أو انقر للتحميل"
                buttonText="اختر الصور"
                multiple
                accept="image/*"
                buttonProps={{
                  variant: "contained",
                  sx: {
                    backgroundColor: "#d3ab49",
                    color: "#fff",
                  },
                }}
              />
            </Box>

            {uploadImages.length > 0 && (
              <>
                <Typography className="mt-6 mb-2 font-semibold">معاينة الصور الجديدة</Typography>
                <div className="flex flex-wrap gap-4">
                  {uploadImages.map((file, idx) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div key={`preview-${idx}`} className="relative w-[120px]">
                        <img
                          src={url}
                          alt="معاينة صورة"
                          className="rounded-lg w-full h-[100px] object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="flex justify-end mt-6 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setUploadImages([]);
                  setDeleteImageIds([]);
                }}
              >
                إلغاء
              </Button>
              <Button onClick={handleSave} disabled={isSaving || uploadImages.length === 0}>
                {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
