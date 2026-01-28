'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import illnesses from "../../../../../../public/multiOptions/illnesses.json";
import dynamic from "next/dynamic";
import TeethSelector from "@/components/ui/teethSelector";
import {  Typography, Box } from "@mui/material";
import FileUpload from "react-material-file-upload";
import Select from "@/components/form/Select";

const PageBreadcrumb = dynamic(() => import("@/components/common/PageBreadCrumb"));
const DatePicker = dynamic(() => import("@/components/form/date-picker"));
const Label = dynamic(() => import("@/components/form/Label"));
const Input = dynamic(() => import("@/components/form/input/InputField"));
const MultiSelect = dynamic(() => import("@/components/form/MultiSelect"));
const ComponentCard = dynamic(() => import("@/components/common/ComponentCard"));
const Button = dynamic(() => import("@/components/ui/button/Button"));
const Form = dynamic(() => import("@/components/form/Form"));

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [selectedIllnesses, setSelectedIllnesses] = useState<{ id: string; value: string }[]>([]);
  const [selectedTeeth, setSelectedTeeth] = useState<{ id: string, value: string }[]>([]);
  const [customTreatments, setCustomTreatments] = useState<
    { id: string, value: string, customTreatment: string }[]
  >([]);

  const [sessionDate, setSessionDate] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [nextSessionDate, setNextSessionDate] = useState<string>("");
  const [nextSessionTime, setNextSessionTime] = useState<string>(""); // format: "HH:MM"
  const [images, setImages] = useState<File[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    work: "",
    phone: "",
    info: "",
    payment: "",
    treatmentName: "", // new field
    treatmentCost: "", // new field
    medicines: "",     // dash separated medicines
    treatmentCurrency: "SYP", // 👈 عملة التكلفة الإجمالية
     paymentCurrency: "SYP",   // 👈 عملة الدفعة الحالية
  });

  const illnessesOptions = illnesses.map(option => ({
    ...option,
    selected: option.selected || false  // Ensures the selected field is always set
  }));

const currencyOptions = [
  { value: "SYP", label: "SYP (ليرة سوري)" },
  { value: "USD", label: "USD (دولار)" },
  { value: "EUR", label: "EUR (يورو)" },
];

  let finalNextSessionDate = null;
  if (nextSessionDate && nextSessionTime) {
    const [hours, minutes] = nextSessionTime.split(":").map(Number);
    const dateObj = new Date(nextSessionDate);
    dateObj.setHours(hours);
    dateObj.setMinutes(minutes);
    finalNextSessionDate = dateObj;
  }

  const handleChange = (name: string, value: string) => {
    const convertArabicToEnglishNumbers = (input: string): string => {
      const arabicNumbers: Record<string, string> = {
        '٠': '0',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9',
      };
      return input.replace(/[٠-٩]/g, (d) => arabicNumbers[d]);
    };

    const cleanedValue = name === "phone" ? convertArabicToEnglishNumbers(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!formData.age.trim()) newErrors.age = "العمر مطلوب";

    const hasTreatment = formData.treatmentName.trim();
    const hasCost = !!formData.treatmentCost && Number(formData.treatmentCost) > 0;
    const hasTeeth = selectedTeeth.length > 0;

    if (!hasTreatment) newErrors.treatmentName = "اسم العلاج مطلوب";
    if (!hasCost) newErrors.treatmentCost = "تكلفة العلاج مطلوبة ويجب أن تكون رقمًا";
    if (!hasTeeth) newErrors.teeth = "يرجى تحديد السن/الأسنان للعلاج";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
     const treatments = [
  {
    treatmentNames: [{ name: formData.treatmentName.trim() }],
    cost: Number(formData.treatmentCost),
    currency: formData.treatmentCurrency, // 👈 إرسال عملة العلاج
    teeth: selectedTeeth.map(tooth => ({
      id: tooth.id,
      value: tooth.value,
      customTreatment: customTreatments.find(ct => ct.id === tooth.id)?.customTreatment || "",
    })),
    sessions: formData.payment ? [
      {
        sessionDate: sessionDate ? new Date(sessionDate).toISOString() : undefined,
        Payments: formData.payment,
        paymentCurrency: formData.paymentCurrency, // 👈 إرسال عملة الدفعة
        PaymentsDate: paymentDate ? new Date(paymentDate).toISOString() : undefined,
      }
    ] : [],
  }
];

      const patientData = {
        name: formData.name.trim(),
        phone: Number(formData.phone),
        age: formData.age.trim(),
        work: formData.work?.trim() || "",
        info: formData.info?.trim() || "",
        illnesses: selectedIllnesses.length
          ? selectedIllnesses.map(({ value }) => ({ illness: value }))
          : [],
        Medicines: formData.medicines
          ? formData.medicines
            .split("-")
            .map(m => m.trim())
            .filter(Boolean)
            .map(medicine => ({ medicine }))
          : [],
        nextSessionDate: nextSessionDate ? new Date(nextSessionDate).toISOString() : null,
        treatments,
      };

     const form = new FormData();
form.append("name", patientData.name);
form.append("phone", patientData.phone.toString());
form.append("age", patientData.age);
form.append("work", patientData.work);
form.append("info", patientData.info);
form.append("nextSessionDate", patientData.nextSessionDate || "");

form.append("treatments", JSON.stringify(patientData.treatments));
form.append("Medicines", JSON.stringify(patientData.Medicines));
form.append("illnesses", JSON.stringify(patientData.illnesses));

images.forEach((file, index) => {
  if (!(file instanceof File)) {
    console.error(`Invalid image at index ${index}`);
  } else {
    form.append("images", file);
  }
});

const response = await fetch("/api/patients", {
  method: "POST",
  body: form,
  credentials: "include",
});

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/profile/${data.data.patientId}`);
      } else {
        console.error("حدث خطأ أثناء الإضافة");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="اضافة مريض جديد" />

      <div className="space-y-6">
        <Form onSubmit={handleSubmit}  >
          <ComponentCard title="معلومات المريض">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div>
                <Label>الاسم</Label>
                <Input name="name" type="text" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

              </div>
              <div>
                <Label>العمر</Label>
                <Input name="age" type="text" value={formData.age} onChange={(e) => handleChange("age", e.target.value)} />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}

              </div>
              <div>
                <Label>المهنة</Label>
                <Input name="work" type="text" value={formData.work} onChange={(e) => handleChange("work", e.target.value)} />

              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 mt-6">
              <div>
                <Label>رقم الهاتف</Label>
                <Input name="phone" type="text" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="relative">
                <MultiSelect
                  label="الأمراض"
                  options={illnessesOptions}
                  defaultSelected={selectedIllnesses.map(i => i.value)} // قيمة الـ value فقط لتحديد الاختيارات المبدئية
                  onChange={(values) => setSelectedIllnesses(values)} // الآن تُخزن الكائنات كاملة
                />
              </div>

              <div>
                <Label>الأدوية (افصل بين الأدوية بـ " - ")</Label>
                <Input
                  name="medicines"
                  type="text"
                  value={formData.medicines}
                  onChange={(e) => handleChange("medicines", e.target.value)}
                  placeholder="مثال: دواء1 - دواء" />
              </div>

            </div>



            <div className="mt-6">
              <Label>معلومات اخرى عن المريض</Label>
              <textarea
                name="info"
                placeholder="معلومات اخرى عن المريض"
                rows={6}
                value={formData.info}
                onChange={(e) => handleChange("info", e.target.value)}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </ComponentCard>
       <Box className="mt-4">
  <Typography className="mb-2 font-semibold">صور المريض</Typography>
  <FileUpload
    value={images}
    onChange={setImages}
    title="اسحب الصور هنا أو انقر للتحميل"
    buttonText="اختر الصور"
    multiple
    accept="image/*"
    buttonProps={{
    variant: "contained",
    sx: {
      backgroundColor: "#d3ab49",   // your custom color
      color: "#fff",                // text color
    }
  }}
  />
</Box>
          <ComponentCard title="العلاج و الجلسات">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mt-6">
              <div>
                <Label>اسم العلاج (افصل بين العلاجات بـ " - ")</Label>
                <Input
                  name="treatmentName"
                  type="text"
                  value={formData.treatmentName}
                  onChange={(e) => handleChange("treatmentName", e.target.value)}
                  placeholder="مثال: حشو - تنظيف"
                />
                {errors.treatmentName && <p className="text-red-500 text-sm mt-1">{errors.treatmentName}</p>}

              </div>
<div>
  <Label>تكلفة العلاج </Label>
  <div className="flex items-center gap-2">
    {/* حقل إدخال التكلفة */}
    <div className="flex-grow w-1/2">
      <Input
        name="treatmentCost"
        type="number"
        value={formData.treatmentCost}
        onChange={(e) => handleChange("treatmentCost", e.target.value)}
        placeholder="أدخل تكلفة العلاج"
      />
    </div>

    {/* مكون الاختيار المخصص للعملة */}
    
    <div className="w-1/2">
    
      <Select
        options={currencyOptions}
        defaultValue={formData.treatmentCurrency || "SYP"}
        onChange={(value) => handleChange("treatmentCurrency", value)}
      />
    </div>
  </div>
  
  {/* عرض رسالة الخطأ إن وجدت */}
  {errors.treatmentCost && (
    <p className="text-red-500 text-sm mt-1">{errors.treatmentCost}</p>
  )}
</div>


              <TeethSelector
                onSelectionChange={(teeth, customTreats) => {
                  setSelectedTeeth(teeth);
                  if (customTreats) setCustomTreatments(customTreats);
                }}
                enableCustomTreatments={true}
              />



            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div>
<DatePicker
  id="session-date"
  label="تاريخ الجلسة الحالية"
  placeholder="حدد التاريخ"
  value={sessionDate ? [new Date(sessionDate)] : []}
  onChange={(dates: Date[]) => {
    if (dates.length > 0) {
     
      const localDateStr = dates[0].toLocaleDateString('en-CA'); // e.g. "1999-08-04"
      setSessionDate(localDateStr);
    }
  }}
/>


              </div>

           <div>
  <Label>الدفعة والعملة</Label>
  <div className="flex items-center gap-2">
    {/* حقل إدخال المبلغ */}
    <div className="flex-grow w-1/2">
      <Input 
        name="payment" 
        type="text" 
        value={formData.payment} 
        onChange={(e) => handleChange("payment", e.target.value)} 
        placeholder="المبلغ المدفوع"
      />
    </div>

    {/* مكون الاختيار المخصص الخاص بك */}
    <div className="w-1/2">
    
      <Select
        options={currencyOptions}
        defaultValue={formData.treatmentCurrency || "SYP"}
        onChange={(value) => handleChange("treatmentCurrency", value)}
      />
    </div>
  </div>
</div>

              <div>
                <DatePicker
                  id="payment-date"
                  label="تاريخ الدفعة"
                  placeholder="حدد التاريخ"
                  value={paymentDate ? [new Date(paymentDate)] : []}
                  onChange={(dates) => {
                    if (dates.length > 0) {
                      const localDateStr = dates[0].toLocaleDateString('en-CA');
                      setPaymentDate(localDateStr);
                    } else {
                      setPaymentDate(""); // Clear the date if none is selected
                    }
                  }}
                />
              </div>

              <div>
                <DatePicker
                  id="next-session-date"
                  label="تاريخ الجلسة القادمة (في حال تم تحديدها)"
                  placeholder="حدد التاريخ"
                  value={nextSessionDate ? [new Date(nextSessionDate)] : []}
                  onChange={(dates) => {
                    if (dates.length > 0) {
                     
                      setNextSessionDate(dates[0].toLocaleDateString('en-CA'));
                    } else {
                      setNextSessionDate("");
                    }
                  }}
                />
              </div>

              <div>
                <Label>الوقت</Label>
                <input
                  type="time"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nextSessionTime}
                  onChange={(e) => setNextSessionTime(e.target.value)}
                />
              </div>
            </div>
          </ComponentCard>



          <Button type="submit" className="my-5" disabled={loading}>
            {loading ? "جارٍ الإضافة..." : "إضافة"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
export default Page;