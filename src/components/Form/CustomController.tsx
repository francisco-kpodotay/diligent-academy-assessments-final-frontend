import { toCamelCase } from "@/lib/utils";
import { FormControl, FormLabel, TextField } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

interface ControllerProps {
  label: string;
  placeholder: string;
  control?: any;
  formState?: any;
}

const CustomController: React.FC<ControllerProps> = ({
  label,
  placeholder,
  control,
  formState,
}) => {
  const camelCaseLabel = toCamelCase(label);

  return (
    <Controller
      name={camelCaseLabel}
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormLabel htmlFor={camelCaseLabel}>{label}</FormLabel>
          <TextField
            {...field}
            required
            fullWidth
            placeholder={placeholder}
            error={!!formState.errors[camelCaseLabel]}
            helperText={formState.errors[camelCaseLabel]?.message?.toString()}
            color={!!formState.errors[camelCaseLabel] ? "error" : "primary"}
          />
        </FormControl>
      )}
    />
  );
};

export default CustomController;
