import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ChatPage from "../ChatPage";

const mockExecute = vi.fn();

vi.mock("@/modules/recruit/application/use-cases/chat-candidates.usecase", () => ({
  ChatCandidatesUseCase: class {
    execute = mockExecute;
  },
}));

vi.mock("@/app/providers/error-dialog-context", () => ({
  useErrorDialog: () => ({
    showError: vi.fn(),
    hideError: vi.fn(),
  }),
}));

describe("ChatPage", () => {
  beforeEach(() => {
    mockExecute.mockReset();
    mockExecute.mockResolvedValue({
      answer: "Here is what I found about Dixon Albites.",
      candidates: [
        {
          name: "Dixon Albites",
          cv: {
            uri: "s3://bucket/candidate.pdf",
            downloadUrl: "/api/download",
          },
        },
      ],
    });
  });

  it("sends a user message and shows assistant response", async () => {
    render(<ChatPage />);

    const input = screen.getByPlaceholderText(/Message Recruit-AI/i);
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(button);

    expect(screen.getByText("Hello!")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith("Hello!");
      const responses = screen.getAllByText(
        (content, node) =>
          node?.textContent?.includes("Here is what I found about Dixon Albites.") ?? false
      );
      expect(responses.length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText("Dixon Albites").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Download CV/i }).length).toBeGreaterThan(0);

    const candidateButton = screen.getAllByRole("button", { name: "Dixon Albites" })[0];
    fireEvent.click(candidateButton);

    await waitFor(() =>
      expect(
        screen.getByText("You're previewing Dixon Albites's resume.")
      ).toBeInTheDocument()
    );
  });
});
