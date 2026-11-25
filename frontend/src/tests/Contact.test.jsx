import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Contact from "../components/Contact";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  submitContactMessage: vi.fn(),
}));

describe("Contact form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation errors when required fields are empty or invalid", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/at least 2 characters required/i)).toBeInTheDocument();
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 10 characters required/i)).toBeInTheDocument();
    expect(api.submitContactMessage).not.toHaveBeenCalled();
  });

  it("validates email format and minimum message length", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText(/name/i), "Karthik");
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByLabelText(/message/i), "Too short");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    expect(api.submitContactMessage).not.toHaveBeenCalled();
  });

  it("disables submit while loading and shows success message on valid submit", async () => {
    const user = userEvent.setup();
    let resolveRequest;
    api.submitContactMessage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );

    render(<Contact />);

    await user.type(screen.getByLabelText(/name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/subject/i), "Internship");
    await user.type(
      screen.getByLabelText(/message/i),
      "Hello Karthik, reaching out about a backend internship role."
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();

    resolveRequest({ status: "sent", message: "Thanks for reaching out! Your message has been sent." });

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/your message has been sent/i);
    });
    expect(screen.getByLabelText(/name/i)).toHaveValue("");
  });

  it("shows friendly error banner when API request fails", async () => {
    const user = userEvent.setup();
    api.submitContactMessage.mockRejectedValueOnce({ response: { status: 429 } });

    render(<Contact />);

    await user.type(screen.getByLabelText(/name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(
      screen.getByLabelText(/message/i),
      "Hello Karthik, reaching out about a backend internship role."
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/too many submissions/i);
  });
});
