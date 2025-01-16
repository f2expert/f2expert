import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Header from "./Header";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Header Component", () => {
  /*it("renders social media icons with links", () => {
    render(<Header />);

    // Check for social media links
    const facebookIcon = screen.getByRole("link", { name: /facebook/i });
    const twitterIcon = screen.getByRole("link", { name: /twitter/i });
    const instagramIcon = screen.getByRole("link", { name: /instagram/i });
    const githubIcon = screen.getByRole("link", { name: /github/i });
    const linkedinIcon = screen.getByRole("link", { name: /linkedin/i });

    // Assert their presence
    expect(facebookIcon).toBeInTheDocument();
    expect(twitterIcon).toBeInTheDocument();
    expect(instagramIcon).toBeInTheDocument();
    expect(githubIcon).toBeInTheDocument();
    expect(linkedinIcon).toBeInTheDocument();
  });*/

  it("renders contact details", () => {
    render(<Header />);

    // Check for contact information
    const phoneLink = screen.getByText(/call : \+919990012545/i);
    const emailLink = screen.getByText(/e-mail : info@f2expert.com/i);

    // Assert their presence
    expect(phoneLink).toBeInTheDocument();
    expect(emailLink).toBeInTheDocument();
  });
});
