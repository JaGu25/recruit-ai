import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatPage from "../ChatPage";

describe("ChatPage", () => {
  it("sends a user message and shows assistant response", async () => {
    render(<ChatPage />);

    const input = screen.getByPlaceholderText(/Message Recruit-AI/i);
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(button);

    expect(screen.getByText("Hello!")).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText("I'll analyze your CV data soon. (Simulated response)")
      ).toBeInTheDocument()
    );
  });
});
