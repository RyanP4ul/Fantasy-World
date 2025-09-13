import { IconBrandDiscord } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { is } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { set } from "zod";

export default function DiscordIntegration({
  discordId,
}: {
  discordId: string | null | undefined;
}) {

  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onConnect = async () => {
    setIsLoading(true);

    const res = await signIn("discord", {
      redirect: false,
      callbackUrl: "/account",
    });

    if (res?.error) {
      window.location.href = "/auth/denied";
    }

    if (res?.url) {
      window.location.href = res.url
    }

    setIsLoading(false);
  };

  const onDisconnect = async () => {
    setIsFetching(true);
    setIsLoading(true);

    const res = await fetch(`/api/auth/account/discord`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ discordId }),
    });

    if (res.ok) {
      discordId = null;
    } else {
      toast.error("Failed to disconnect Discord", {
        description: "Please try again later.",
      });
    }

    setIsFetching(false);
    setIsLoading(false);
  };

  return (
    <>
      {discordId != null ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <IconBrandDiscord className="text-white text-xl" />
            </div>
            <div>
              <p className="text-white">Discord Connected</p>
              <p className="text-xs text-green-400 mt-1">
                <i className="ri-checkbox-circle-fill mr-1"></i>
                Verified Discord Account
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={async () => await onDisconnect()}
              disabled={isFetching || isLoading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap cursor-pointer"
            >
              {isFetching ? (
                <div className="flex items-center">
                  <Loader2Icon className="animate-spin mr-2" />
                  Disconnecting...
                </div>
              ) : (
                "Disconnect"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <IconBrandDiscord className="text-white text-xl" />
            </div>
            <div>
              <p className="text-gray-400">Discord Not Connected</p>
              <p className="text-sm text-gray-500">
                Connect your Discord account for exclusive benefits
              </p>
            </div>
          </div>
          <Button
            onClick={async () => await onConnect()}
            disabled={isFetching || isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap cursor-pointer"
          >
            Connect Discord
          </Button>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-white font-medium mb-2">Discord Benefits</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li className="flex items-center">
            <i className="ri-check-line text-green-400 mr-2"></i>
            Exclusive Discord-only rewards
          </li>
          <li className="flex items-center">
            <i className="ri-check-line text-green-400 mr-2"></i>
            Real-time game notifications
          </li>
          <li className="flex items-center">
            <i className="ri-check-line text-green-400 mr-2"></i>
            Community events access
          </li>
          <li className="flex items-center">
            <i className="ri-check-line text-green-400 mr-2"></i>
            Direct support channel
          </li>
        </ul>
      </div>
    </>
  );
}
