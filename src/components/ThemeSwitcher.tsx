"use client";

import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Moon, SunMedium } from "lucide-react";
import { useClient } from "@/lib/useClient";

export function ThemeSwitcher() {
  const { isClient } = useClient();
  const { theme, systemTheme, setTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!isClient) return null;

  return (
    <Switch
      color="primary"
      classNames={{ wrapper: ["mr-0"] }}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunMedium
            className={className}
            fill="currentColor"
            height="1em"
            width="1em"
          />
        ) : (
          <Moon
            className={className}
            fill="currentColor"
            height="1em"
            width="1em"
          />
        )
      }
      onValueChange={(e) => setTheme(e ? "dark" : "light")}
      isSelected={currentTheme === "dark"}
    />
  );
}
