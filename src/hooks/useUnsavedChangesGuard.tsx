"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/common/modal/ModalContext";
import { useTranslations } from "next-intl";

export const useUnsavedChangesGuard = (isDirty: boolean) => {
  const t = useTranslations("common");
  const router = useRouter();
  const { open, close } = useModal();
  const bypassRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const isHandlingPopstateRef = useRef(false);

  const bypassNextNavigation = useCallback(() => {
    bypassRef.current = true;
    setTimeout(() => {
      bypassRef.current = false;
    }, 0);
  }, []);

  // 일정 시간 동안 새로고침 경고를 비활성화
  const bypassFor = useCallback((durationMs: number = 2000) => {
    bypassRef.current = true;
    setTimeout(
      () => {
        bypassRef.current = false;
      },
      Math.max(0, durationMs),
    );
  }, []);

  const confirmNavigate = useCallback(
    (onConfirm: () => void) => {
      open({
        title: t("unsaved.leaveConfirmTitle"),
        children: (
          <div className="">
            <p className="mb-2 text-gray-700">{t("unsaved.leaveConfirmMessage1")}</p>
            <p className="text-gray-700">{t("unsaved.leaveConfirmMessage2")}</p>
          </div>
        ),
        buttons: [
          {
            variant: "outlined" as const,
            text: t("cancel"),
            onClick: () => close(),
          },
          {
            text: t("unsaved.leave"),
            onClick: () => {
              close();
              bypassRef.current = true;
              onConfirm();
              // reset bypass in next tick
              setTimeout(() => {
                bypassRef.current = false;
              }, 0);
            },
          },
        ],
      });
    },
    [open, close],
  );

  // Warn on browser unload/refresh
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty || bypassRef.current) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // Intercept anchor navigations
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!isDirty || bypassRef.current) return;
      const targetEl = (e.target as Element)?.closest<HTMLAnchorElement>("a[href]");
      if (!targetEl) return;
      // Ignore hash/mailto/tel/explicit opt-out
      const href = targetEl.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if ((targetEl as HTMLElement).dataset.ignoreUnsaved === "true") return;

      e.preventDefault();
      pendingHrefRef.current = href;
      confirmNavigate(() => {
        const next = pendingHrefRef.current;
        pendingHrefRef.current = null;
        if (next) router.push(next);
      });
    };
    document.addEventListener("click", onDocClick, { capture: true });
    return () => document.removeEventListener("click", onDocClick, { capture: true } as any);
  }, [isDirty, confirmNavigate, router]);

  // Intercept keyboard refresh (F5, Ctrl/Cmd+R) to bypass prompt and reload immediately
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isDirty) return;
      const key = e.key?.toLowerCase();
      const isF5 = e.key === "F5";
      const isCtrlOrCmdR = key === "r" && (e.ctrlKey || e.metaKey);
      if (isF5 || isCtrlOrCmdR) {
        e.preventDefault();
        bypassRef.current = true;
        // Immediate hard reload without native prompt
        window.location.reload();
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true } as any);
  }, [isDirty]);

  // Intercept browser back/forward (popstate)
  useEffect(() => {
    // push a state so first back triggers popstate
    const push = () => {
      try {
        window.history.pushState({ guard: true }, "", window.location.href);
      } catch {
        // ignore
      }
    };
    push();

    const onPopState = (e: PopStateEvent) => {
      if (isHandlingPopstateRef.current) return;
      if (!isDirty || bypassRef.current) return;
      e.preventDefault();
      // Immediately push state back to cancel the back navigation
      isHandlingPopstateRef.current = true;
      push();
      confirmNavigate(() => {
        // allow one back
        bypassRef.current = true;
        window.history.back();
        setTimeout(() => {
          bypassRef.current = false;
        }, 0);
      });
      setTimeout(() => {
        isHandlingPopstateRef.current = false;
      }, 0);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isDirty, confirmNavigate]);

  return { bypassNextNavigation, bypassFor };
};
