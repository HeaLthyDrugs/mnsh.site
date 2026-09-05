"use client";

import { CaretDown } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { Slot as SlotPrimitive } from "radix-ui";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";


const Slot = SlotPrimitive.Slot;

export function CollapsibleList({
  children,
  max = 3,
}: {
  children: React.ReactNode;
  max?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const items = React.Children.toArray(children);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {items.slice(0, max).map((item, index) => (
        <Slot key={index} className="border-b border-edge">
          {item}
        </Slot>
      ))}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {items.slice(max).map((item, index) => (
              <Slot key={max + index} className="border-b border-edge">
                {item}
              </Slot>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {items.length > max && (
        <div className="flex h-12 items-center justify-center pb-px">
          <CollapsibleTrigger asChild>
            <Button
              className="group/collapsible-trigger cursor-pointer flex rounded-none"
              variant="default"
            >
              <span className="hidden group-data-[state=closed]/collapsible-trigger:block">
                Show More
              </span>

              <span className="hidden group-data-[state=open]/collapsible-trigger:block">
                Show Less
              </span>

              <CaretDown
                className="group-data-[state=open]/collapsible-trigger:rotate-180"
                aria-hidden
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      )}
    </Collapsible>
  );
}

