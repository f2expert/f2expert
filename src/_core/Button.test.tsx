import React from "react"; // Add this line
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Button from "./Button";

test("renders Button component", () => {
  const handleClick = vi.fn();
  render(<Button classes="h-1" text="Click me" onClick={handleClick} />);

  const button = screen.getByText("Click me");
  expect(button).toBeTruthy();

  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
