import type { ComponentType, SVGProps } from "react";

type SvgProps = SVGProps<SVGSVGElement>;
type SvgModule = {
  default?: unknown;
  ReactComponent?: ComponentType<SvgProps>;
};

function unwrap(value: unknown): unknown {
  if (typeof value === "function") return value;
  if (value && typeof value === "object" && "default" in value) {
    const inner = (value as { default: unknown }).default;
    if (typeof inner === "function") return inner;
  }
  return value;
}

export function svgIcon(mod: SvgModule | ComponentType<SvgProps>): ComponentType<SvgProps> {
  if (typeof mod === "function") {
    return mod;
  }

  if (typeof mod.ReactComponent === "function") {
    return mod.ReactComponent;
  }

  const candidate = unwrap(mod.default ?? mod);
  if (typeof candidate === "function") {
    return candidate as ComponentType<SvgProps>;
  }

  return function MissingIcon() {
    return null;
  };
}
