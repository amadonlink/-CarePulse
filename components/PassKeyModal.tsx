"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";

function PassKeyModal() {
  const [open, setopen] = useState(true);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const path = usePathname();

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    //Here we check if the access ke is the same with the in .env
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setopen(false);
        router.push("/admin");
      } else {
        setopen(true);
      }
    }
  }, [encryptedKey]);

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedKey);

      setopen(false);
    } else {
      setError("Invalid passkey, please try again");
    }
  };

  const onCloseModal = () => {
    setopen(true);
    router.push("/");
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setopen}>
        <AlertDialogContent className="shad-alert-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-start justify-between text-gray-400">
              Admin Access Verification
              <Image
                src="/assets/icons/close.svg"
                width="20"
                height="20"
                alt="close"
                onClick={() => onCloseModal()}
                className="cursor-pointer"
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              To access the admin page, please enter the passkey
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <InputOTP
              maxLength={6}
              value={passkey}
              onChange={(value) => setPasskey(value)}
            >
              <InputOTPGroup className="shad-otp">
                <InputOTPSlot className="shad-otp-slot text-white" index={0} />
                <InputOTPSlot className="shad-otp-slot text-white" index={1} />
                <InputOTPSlot className="shad-otp-slot text-white" index={2} />
                <InputOTPSlot className="shad-otp-slot text-white" index={3} />
                <InputOTPSlot className="shad-otp-slot text-white" index={4} />
                <InputOTPSlot className="shad-otp-slot text-white" index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p className="shad-error text-14-regular mt-4 flex justify-center">
                {error}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={(e) => validatePasskey(e)}
              className="shad-primary-btn w-full text-gray-400"
            >
              Enter Admin Passkey
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default PassKeyModal;
