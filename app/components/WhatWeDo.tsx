"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./WhatWeDo.module.css";
import AnimatedText from "./AnimatedText";

export default function WhatWeDo() {
  const items = [
    "Development",
    "Design",
    "Prototyping",
    "Art Direction",
    "Photo",
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [itemOpacities, setItemOpacities] = useState<number[]>(
    items.map(() => 0.4)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    if (isOpen) {
      // Fade in top -> bottom
      setItemOpacities(items.map(() => 0));
      items.forEach((_, index) => {
        const timeout = setTimeout(() => {
          setItemOpacities(prev => {
            const next = [...prev];
            next[index] = 0.4;
            return next;
          });
        }, index * 80);
        timeouts.push(timeout);
      });
    } else {
      // Ensure all items are at base opacity before fading out
      setItemOpacities(items.map(() => 0.4));
      // Fade out bottom -> top with clear stagger so items exit one-by-one
      items.forEach((_, index) => {
        const delay = (items.length - 1 - index) * 350; // longer stagger for distinct exits
        const timeout = setTimeout(() => {
          setItemOpacities(prev => {
            const next = [...prev];
            next[index] = 0;
            return next;
          });
        }, delay);
        timeouts.push(timeout);
      });
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isOpen, items.length]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <button className={`${styles.button} ${isOpen ? styles.buttonOpen : ""}`} onClick={handleButtonClick}>
        <AnimatedText delay={0.5} stagger={0.05}>
          [What we do]
        </AnimatedText>
      </button>
      <div
        ref={menuRef}
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.menuItem}
            style={{ 
              opacity: itemOpacities[index]
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

