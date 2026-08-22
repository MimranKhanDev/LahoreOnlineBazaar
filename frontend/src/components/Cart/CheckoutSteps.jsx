// src/components/Cart/CheckoutSteps.jsx

/**
 * 📋 CHECKOUT STEPS - Stepper for checkout process
 *
 * Shows progress through:
 * 1. Shipping Details
 * 2. Confirm Order
 * 3. Payment
 *
 * 📦 Packages Used:
 * - @mui/material: v5+ (Stepper, Step, StepLabel)
 * - @mui/icons-material: v5+ (icons)
 */

import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import {
  LocalShipping,
  LibraryAddCheck,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const CheckoutSteps = ({ activeStep = 0 }) => {
  // 📋 Step configuration
  const steps = [
    {
      label: "Shipping",
      icon: <LocalShipping />,
    },
    {
      label: "Confirm Order",
      icon: <LibraryAddCheck />,
    },
    {
      label: "Payment",
      icon: <PaymentIcon />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md py-6 px-4"
    >
      <Box sx={{ maxWidth: "600px", margin: "0 auto" }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepConnector-line": {
              display: "none",
            },
            "& .MuiStepConnector-root": {
              height: "2px",
              backgroundColor: "#e5e7eb",
            },
            "& .MuiStepConnector-active": {
              backgroundColor: "#ef4444",
            },
            "& .MuiStepConnector-completed": {
              backgroundColor: "#ef4444",
            },
          }}
        >
          {steps.map((step, index) => (
            <Step
              key={index}
              active={activeStep === index}
              completed={activeStep >= index}
            >
              <StepLabel
                StepIconComponent={() => (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                      activeStep >= index
                        ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
                        : "bg-gray-300"
                    }`}
                  >
                    {step.icon}
                  </div>
                )}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: activeStep >= index ? "#ef4444" : "#9ca3af",
                    fontWeight: activeStep === index ? "bold" : "normal",
                    fontSize: "0.875rem",
                    marginTop: "0.5rem",
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </motion.div>
  );
};

export default CheckoutSteps;
