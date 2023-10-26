"use client";
import React, { useEffect, useState } from "react";
import { useChatStore } from "@/lib/store/chat";
import Mounted from "@/components/mounted";
import { Skeleton } from "@/components/ui/skeleton";

function HeaderTopic() {
  const currentTopic = useChatStore((state) => state.currentSession().topic);
  const [topic, setTopic] = useState(currentTopic);
  useEffect(() => {
    topic !== currentTopic && setTopic(currentTopic);
  }, [currentTopic]);

  return (
    <Mounted fallback={<Skeleton className="h-6 w-16" />}>
      <h2 className="text-base font-medium">{topic}</h2>
    </Mounted>
  );
}

export default HeaderTopic;
