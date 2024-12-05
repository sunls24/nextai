"use client";
import React from "react";
import { useChatStore } from "@/lib/store/chat";
import Mounted from "@/components/mounted";
import { Skeleton } from "@/components/ui/skeleton";

function HeaderTopic() {
  const topic = useChatStore((state) => state.currentSession().topic);

  return (
    <Mounted fallback={<Skeleton className="h-6 w-16" />}>
      <h2 className="text-base font-medium">{topic}</h2>
    </Mounted>
  );
}

export default HeaderTopic;
