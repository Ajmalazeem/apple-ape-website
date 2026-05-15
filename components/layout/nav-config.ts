// components/layout/nav-config.ts
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Games",   href: "/games"   },
  { label: "Web3",    href: "/web3"    },
  { label: "Apps",    href: "/apps"    },
  { label: "About",   href: "/about"   },
  { label: "Careers", href: "/careers" },
  { label: "Blog",    href: "/blog"    },
];
