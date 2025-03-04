"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/useFetch";
import { entrySchema } from "@/app/lib/schema";
import { improveWithAI } from "@/actions/resume";
import { format, parse } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

const EntryForm = ({type, entries, onChange}) => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  // 1. function:: handleAdd()  Add the entry into the form
  const handleAdd = handleValidation((data) => {
    // formatting date
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };
    // updating formData
    onChange([...entries, formattedEntry]);

    reset(); // reseting the form after the entry is added to the form
    setIsAdding(false);
  });

  // 2. function:: handleDelete()  Delete the entry with given index from the form
  const handleDelete = (index) => {
    const newEntries = entries.filter((_, idx) => idx !== index);
    onChange(newEntries);
  };

  // 3. Improve with AI function
  const {
    loading: isImproving,
    makeAPICall: improvedWithAIFunction,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // 4. Handle improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // 5. Calling improveWithAI function for improving content
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }
    await improvedWithAIFunction({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
      //  organizationName: organization
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Displaying entry content */}
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. Entry Form fields */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* 2.1 Title field */}
              <div className="space-y-2">
                <Input
                  placeholder="Title/Position"
                  {...register("title")} // register is used to tie input field with title schema
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              {/* 2.2 Organization field */}
              <div className="space-y-2">
                <Input
                  placeholder="Organization/Company"
                  {...register("organization")}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {/* 2.3 Start Date field */}
                  <Input
                    placeholder="Start Date"
                    type="month"
                    {...register("startDate")}
                    error={errors.startDate}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                {/* 2.4 End Date field */}
                <div className="space-y-2">
                  <Input
                    placeholder="End Date"
                    type="month"
                    {...register("endDate")}
                    disabled={current}
                    error={errors.endDate}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* 2.5 Current checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="current"
                  {...register("current")}
                  onChange={(e) => {
                    setValue("current", e.target.checked);
                    if (e.target.checked) {
                      setValue("endDate", "");
                    }
                  }}
                />
                {/* type : 'experience', 'education', or 'project' */}
                <label htmlFor="current">Current {type}</label>
              </div>

              {/* 2.6 Description field*/}
              <div className="space-y-2">
                <Textarea
                  placeholder={`Description of your ${type.toLowerCase()}`}
                  className="h-32"
                  {...register("description")}
                  error={errors.description}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* 2.6.1 Improve Description with AI */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleImproveDescription}
                disabled={isImproving || !watch("description")}
              >
                {isImproving ? (
                  <>
                    {" "}
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                    Improving...{" "}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Improve with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>

          {/* 3. Buttons */}
          <CardFooter className="flex justify-end space-x-2">
            {/* 3.1 Cancel button: Reset the form */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            {/* 3.2 Add entry button: Add entry to the form */}
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* 4. Button for adding entry: Generate new entry form */}
      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
};

export default EntryForm;
