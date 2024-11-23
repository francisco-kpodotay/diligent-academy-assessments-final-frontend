import {
  Stack,
  styled,
  Card as MuiCard,
  Typography,
  Box,
  Button,
} from "@mui/material";
import React, { ReactElement, ReactNode } from "react";
import { FieldValues, UseFormStateReturn } from "react-hook-form";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

interface CustomFormContainProps {
  title: string;
  btnText: string;
  children: ReactNode;
  handleSubmit: any;
  onSubmit: any;
  control: any;
  formState: UseFormStateReturn<FieldValues>;
}

const CustomFormContainer: React.FC<CustomFormContainProps> = ({
  title,
  btnText,
  children,
  handleSubmit,
  onSubmit,
  control,
  formState,
}) => {
  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {title}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as ReactElement, {
                control,
                formState,
                key: index,
              });
            }
            return null;
          })}

          <Button variant="contained" type="submit">
            {btnText}
          </Button>
        </Box>
      </Card>
    </SignUpContainer>
  );
};

export default CustomFormContainer;
