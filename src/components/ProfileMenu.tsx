import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    })();
  }, []);

  // Compute dropdown placement
  const computePosition = () => {
    const btn = btnRef.current;
    if (!btn) return setPos(null);

    const rect = btn.getBoundingClientRect();
    const dropWidth = 240;
    const viewportWidth = window.innerWidth;

    let left = rect.right - dropWidth + window.scrollX;
    const minLeft = 8 + window.scrollX;
    const maxLeft = viewportWidth - dropWidth - 8 + window.scrollX;

    left = Math.max(minLeft, Math.min(left, maxLeft));

    const top = rect.bottom + 8 + window.scrollY;

    setPos({ left, top, width: dropWidth });
  };

  useEffect(() => {
    if (open) {
      computePosition();
      window.addEventListener("scroll", computePosition, true);
      window.addEventListener("resize", computePosition);
      return () => {
        window.removeEventListener("scroll", computePosition, true);
        window.removeEventListener("resize", computePosition);
      };
    }
  }, [open]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const dropdown = pos ? (
    <div
      data-profile-menu="true"
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
      }}
    >
      {/* Arrow */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: -7,
            right: 20,
            width: 12,
            height: 12,
            background: "white",
            transform: "rotate(45deg)",
            boxShadow: "rgba(0,0,0,0.06) 0px 1px 2px",
          }}
        />
        {/* Dropdown Box */}
        <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b text-sm text-slate-700">
            <div className="font-medium truncate" title={email ?? "User"}>
              {email ?? "User"}
            </div>
            <div className="text-xs text-slate-400">Signed in</div>
          </div>

          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
          >
            My Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* PROFILE BUTTON */}
      <button
        ref={btnRef}
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(computePosition, 0);
        }}
        type="button"
        className="
          w-11 h-11 
          rounded-full 
          bg-white 
          border border-slate-300 
          shadow-sm 
          flex items-center justify-center 
          transition-all 
          hover:shadow-md 
          focus:outline-none 
          focus:ring-2 focus:ring-blue-400
        "
      >
        {/* Blue Initial */}
        <span
          className="
            text-blue-600 
            font-bold 
            text-lg 
            drop-shadow-sm
          "
        >
          {email ? email[0].toUpperCase() : "U"}
        </span>
      </button>

      {open && pos && createPortal(dropdown, document.body)}
    </>
  );
}
