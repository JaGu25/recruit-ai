import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/shared/ui/card";
import { Input } from "@/modules/shared/ui/input";
import { Button } from "@/modules/shared/ui/button";
import { useAuth } from "@/app/providers/auth-context";
import { useErrorDialog } from "@/app/providers/error-dialog-context";
import { FormError } from "@/modules/shared/ui/form-error";

import { loginFormSchema, type LoginFormValues } from "./schema-login-form";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { showError } = useErrorDialog();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await login(values);
      router.navigate({ to: "/recruit/upload" });
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <Card className="w-full max-w-sm border border-border shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Welcome to Recruit-AI
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to access your workspace
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={errors.email ? "true" : "false"}
                {...register("email")}
              />
              <FormError message={errors.email?.message} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password")}
              />
              <FormError message={errors.password?.message} />
            </div>
            <div className="space-y-3 pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
