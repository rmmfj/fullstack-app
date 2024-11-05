"use client";
import type { CardComponentProps } from "onborda";
import { useOnborda } from "onborda";
import React from "react";

// Shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CustomCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  // Onborda hooks
  const { closeOnborda } = useOnborda();

  return (
    <Card className="border-0 rounded-lg min-w-[20rem] max-w-vw bg-gray-50">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle className="mb-2 text-lg">
              {step.icon} {step.title}
            </CardTitle>
            <CardDescription>
              第 {currentStep + 1} ／ {totalSteps} 步
            </CardDescription>
          </div>
          {/* <Button variant="ghost" size="icon" onClick={() => closeOnborda()}>
            <XIcon size={16} />
          </Button> */}
        </div>
      </CardHeader>
      <CardContent>{step.content}</CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          {currentStep !== 0 && (
            <Button onClick={() => prevStep()}>上一步</Button>
          )}
          {currentStep + 1 !== totalSteps && (
            <Button onClick={() => nextStep()} className="ml-auto">
              下一步
            </Button>
          )}
          {currentStep + 1 === totalSteps && (
            <Button onClick={closeOnborda} className="ml-auto">
              🎉 我瞭解了！
            </Button>
          )}
        </div>
      </CardFooter>
      <span className="text-card">{arrow}</span>
    </Card>
  );
};

export default CustomCard;