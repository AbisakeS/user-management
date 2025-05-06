import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";
import { useState } from "react";


export default function Home() {
  const [open, setOpen] = useState(false);
  const initialFormState = {
    name: '',
    email: '',
    linkedin: '',
    gender: '',
    address: { line1: '', line2: '', state: '', city: '', pin: '' }
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    linkedin: '',
    gender: '',
    address: { city: '' }
  });
  const handleOpenAddDialog = () => {
    setForm(initialFormState);
    setErrors({
      name: '',
      email: '',
      linkedin: '',
      gender: '',
      address: { city: '' }
    });
    setOpen(true);
  };
  return (
    <>
      <div className="p-4">
        <UserForm  {...{open,setOpen,form, setForm,errors, setErrors,initialFormState}}/>
        <UserTable {...{handleOpenAddDialog}}/>
      </div>
    </>
  );
}
