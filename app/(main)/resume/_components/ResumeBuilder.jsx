"use client";
import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { resumeSchema } from "@/app/lib/schema";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";

const ResumeBuilder = ({ initialContent }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setpreviewContent] = useState(initialContent);
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control, // Control and manipulate the form
    register,
    handleSubmit, // Submit the form
    watch, // Watch one or multiple form fields
    formState: { errors }, // Contains error related to the form fields
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  return (
    <div data-color-mode="light" className="space-y-4">
      {/* 1. Top */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 ">
        {/* 1.1 Heading */}
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        {/* 1.2 Save and Download button */}
      </div>
    </div>
  );
};

export default ResumeBuilder;
