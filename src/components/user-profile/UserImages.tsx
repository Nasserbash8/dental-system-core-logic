'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box } from "@mui/material";
import FileUpload from "react-material-file-upload";
import Modal from '../ui/modal';
import { Plus, Trash2, Calendar, Eye } from "lucide-react";
import Button from "../ui/button/Button";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

type Image = {
  _id: string;
  src: string;
  date: string | Date;
};

type Props = {
  patient: {
    patientId: string;
    images: Image[];
  };
};

export default function UserImages({ patient }: Props) {
  const [images, setImages] = useState<Image[]>(patient.images || []);
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [index, setIndex] = useState<number>(-1);

  // تحسين الأداء باستخدام useMemo لتحضير شرائح الـ Lightbox
  const slides = useMemo(() => images.map((img) => ({
    src: img.src,
    width: 1200,
    height: 800,
    title: "صورة سريرية",
    description: img.date
      ? `تم الرفع في: ${new Date(img.date).toLocaleDateString("ar-EG", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
      : "التاريخ غير متوفر",
  })), [images]);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة نهائياً؟")) return;

    // متفائل (Optimistic Update)
    const previousImages = [...images];
    setImages((prev) => prev.filter((img) => img._id !== id));

    try {
      const response = await fetch(`/api/patients/${patient.patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteImageIds: [id] }),
      });

      if (!response.ok) throw new Error("فشل الحذف");
    } catch (error) {
      console.error("خطأ أثناء الحذف:", error);
      setImages(previousImages); // تراجع في حال الفشل
    }
  };

  const handleSave = async () => {
    if (isSaving || uploadImages.length === 0) return;
    setIsSaving(true);

    try {
      const formData = new FormData();
      uploadImages.forEach((file) => formData.append('newImages', file));

      const res = await fetch(`/api/patients/${patient.patientId}`, {
        method: 'PATCH',
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setImages(result.data.images || []);
        setUploadImages([]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("خطأ أثناء الرفع:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">معرض صور المريض</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-100"
          >
            <Plus size={18} />
            <span className="text-sm font-bold">إضافة صور</span>
          </button>
        </div>

        {/* شبكة الصور (Gallery Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length > 0 ? images.map((img, i) => (
            <div key={img._id} className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
              <img
                src={img.src}
                alt="Patient case"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                onClick={() => setIndex(i)}
              />
              
              {/* Overlay عند التحويم */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => setIndex(i)} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40">
                  <Eye size={20} />
                </button>
                <button onClick={() => handleDelete(img._id)} className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600">
                  <Trash2 size={20} />
                </button>
              </div>

              {/* تاريخ الصورة المصغر */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-[10px] text-white flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(img.date).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
              <p className="text-gray-400 font-medium">لا توجد صور مسجلة لهذا المريض بعد.</p>
            </div>
          )}
        </div>

        {/* Lightbox */}
        <Lightbox
          slides={slides}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Captions]}
          carousel={{ finite: true }}
          styles={{ container: { backgroundColor: "rgba(0, 0, 0, .95)" } }}
        />
      </div>

      {/* مودال الرفع */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isFullscreen>
        <div className="p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h4 className="text-2xl font-bold text-gray-900">إدارة سجل الصور</h4>
            <p className="text-gray-500">ارفع صوراً جديدة للتوثيق الطبي أو لتتبع حالة الحالة.</p>
          </div>

          <Box className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <FileUpload
              value={uploadImages}
              onChange={setUploadImages}
              title="اسحب الصور هنا أو انقر لاختيار ملفات"
              buttonText="تصفح الجهاز"
              multiple
              accept="image/*"
              buttonProps={{
                variant: "contained",
                sx: { backgroundColor: "#d3ab49", borderRadius: '12px', padding: '8px 24px' }
              }}
            />
          </Box>

          {/* معاينة الصور المختارة للرفع */}
          {uploadImages.length > 0 && (
            <div className="mt-10">
              <Typography className="mb-4 font-bold flex items-center gap-2">
                <span className="w-6 h-6 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-xs">{uploadImages.length}</span>
                صور مختارة للرفع
              </Typography>
              <div className="flex flex-wrap gap-4">
                {uploadImages.map((file, idx) => (
                   <PreviewImage key={idx} file={file} />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-12 gap-3">
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setUploadImages([]); }}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isSaving || uploadImages.length === 0} className="px-8 font-bold">
              {isSaving ? "جاري المعالجة..." : "تأكيد ورفع الصور"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// مكون فرعي للمعاينة لمنع Memory Leaks
function PreviewImage({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  return (
    <div className="relative group overflow-hidden rounded-xl border dark:border-gray-700">
      <img src={url} alt="preview" className="w-[120px] h-[120px] object-cover transition-transform group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}