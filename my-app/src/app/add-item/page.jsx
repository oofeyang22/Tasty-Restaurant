import AddItemPage from "../components/AddItem";
import { Toaster } from "react-hot-toast";

export default function AddItemPage() {

  return (

    <div className="max-w-2xl mx-auto py-20">

      <Toaster />

      <h1 className="text-3xl font-bold mb-10 mx-6 ">
        Add New Food Item
      </h1>

      <AddItemPage />

    </div>

  );

}