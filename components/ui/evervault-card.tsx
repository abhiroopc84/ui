"use client";

import { ReactElement, Ref, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const GridImage = ({
  children,
  colors,
}: {
  children: ReactElement;
  colors?: { dark?: string[]; light?: string[] };
}) => {
  const { resolvedTheme } = useTheme();
  let darkGradient =
    "rgb(23, 24, 37) 40%, rgb(102, 51, 238) 50%, rgb(142, 100, 255), rgb(249, 38, 114)";
  let lightGradient =
    "rgb(232,231,218) 40%, rgb(153,204,17) 50%, rgb(113,155,0), rgb(6,217,141)";
  if (colors) {
    if (colors.dark && colors.dark.length >= 3) {
      darkGradient = `rgb(23, 24, 37) 40%, ${colors.dark[0]}, ${colors.dark[1]}, ${colors.dark[2]}`;
    }
    if (colors.light && colors.light.length >= 3) {
      lightGradient = `rgb(232,231,218) 40%, ${colors.light[0]}, ${colors.light[1]}, ${colors.light[2]}`;
    }
  }

  return (
    <div
      className={cn(
        "flex aspect-square justify-center items-center rounded-3xl relative cursor-pointer min-w-64 min-h-64 max-w-[500px] max-h-[500px]"
      )}
    >
      {children}
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-full rounded-3xl dark:mix-blend-darken mix-blend-lighten"
        )}
        style={{
          backgroundImage: `radial-gradient(${
            resolvedTheme === "light" ? lightGradient : darkGradient
          })`,
        }}
      ></div>
    </div>
  );
};

const GridText = ({
  children,
  position,
  divRef,
}: {
  children: ReactElement;
  position: { x: number; y: number };
  divRef: Ref<HTMLDivElement>;
}) => {
  const { resolvedTheme } = useTheme();
  return (
    <div
      ref={divRef}
      className={cn(
        "absolute hover:opacity-1 top-0 left-0 h-full w-full font-mono text-foreground text-wrap flex flex-col break-all text-xs rounded-3xl overflow-clip transition delay-150 ease-in-out opacity-0"
      )}
      style={{
        WebkitMaskImage: `radial-gradient(350px circle at ${position.x}px ${
          position.y
        }px, ${
          resolvedTheme === "dark" ? "black" : "white"
        } 20%, rgba(0,0,0,0.25), transparent)`,
        maskImage: `radial-gradient(350px circle at ${position.x}px ${
          position.y
        }px, ${
          resolvedTheme === "dark" ? "black" : "white"
        } 20%, rgba(0,0,0,0.25), transparent)`,
      }}
    >
      {children}
    </div>
  );
};

const EvervaultCard = ({
  children,
  colors,
}: {
  children: ReactElement;
  colors?: { dark?: string[]; light?: string[] };
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [randText, setRandText] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const setFromEvent = (e: MouseEvent) => {
      if (divRef.current) {
        if (
          e.clientX > divRef.current.getBoundingClientRect().left &&
          e.clientX < divRef.current.getBoundingClientRect().right &&
          e.clientY > divRef.current.getBoundingClientRect().top &&
          e.clientY < divRef.current.getBoundingClientRect().bottom
        ) {
          divRef.current.style.opacity = "100";
          setPosition({
            x: e.clientX - divRef.current.getBoundingClientRect().left,
            y: e.clientY - divRef.current.getBoundingClientRect().top,
          });
          setRandText(getRandomString(1500));
        } else {
          divRef.current.style.opacity = "0";
        }
      }
    };
    const getRandomString = (length: number) => {
      let result = "";
      let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    };
    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  if (!mounted)
    return (
      <Skeleton
        className={cn("flex w-full h-full aspect-square rounded-3xl")}
      />
    );

  return (
    <GridImage colors={colors || undefined}>
      <>
        <div className={cn("z-10 fill-foreground text-foreground")}>
          {children}
        </div>
        <GridText divRef={divRef} position={position}>
          <>{randText}</>
        </GridText>
      </>
    </GridImage>
  );
};

export default EvervaultCard;
