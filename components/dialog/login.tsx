import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useConfig } from "@/lib/store/config";

function Login({
  trigger,
  email,
}: {
  trigger: React.ReactNode;
  email?: string;
}) {
  const [username, setUsername] = useState(email ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const updateCfg = useConfig((state) => state.Update);

  async function onLogin() {
    if (!username || !password) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reverse/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      const body = await res.json();
      if (body.msg) {
        throw new Error(body.msg);
      }
      updateCfg((cfg) => {
        cfg.login = {
          enable: true,
          data: body,
        };
        cfg.apiConfig.apiKey = body.accessToken;
      });
      toast.success("登录成功");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) {
      return;
    }
    e.preventDefault();
    await onLogin();
  }

  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI 账号登录</DialogTitle>
          <DialogDescription>
            使用 ChatGPT 转 API 的方式调用，插件功能不可用
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-3">
          <Label>用户名</Label>
          <Input
            disabled={loading}
            className="col-span-3"
            value={username}
            onKeyDown={onKeyDown}
            onChange={(e) => setUsername(e.currentTarget.value.trim())}
          />
          <Label>密码</Label>
          <Input
            disabled={loading}
            className="col-span-3"
            value={password}
            onKeyDown={onKeyDown}
            onChange={(e) => setPassword(e.currentTarget.value.trim())}
          />
          <span className="col-span-3" />
          <Button disabled={loading} onClick={onLogin}>
            {loading ? (
              <RefreshCcw
                size={20}
                strokeWidth={1.8}
                className="animate-spin"
              />
            ) : (
              "登录"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Login;
