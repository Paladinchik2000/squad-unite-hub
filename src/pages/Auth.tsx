import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ocoLogo from "@/assets/oco-logo.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Ошибка", description: error.message, variant: "destructive" });
      } else {
        navigate("/cabinet");
      }
    } else {
      if (!nickname.trim()) {
        toast({ title: "Ошибка", description: "Введите никнейм", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, nickname.trim());
      if (error) {
        toast({ title: "Ошибка", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Регистрация",
          description: "Проверьте почту для подтверждения аккаунта",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <img src={ocoLogo} alt="ОСО" className="h-20 w-auto" />
          <h1 className="font-display text-2xl text-gradient">
            {isLogin ? "Вход в кабинет" : "Регистрация"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-display text-muted-foreground mb-1">Никнейм</label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="YourCallsign"
                className="bg-card border-border"
                maxLength={30}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-display text-muted-foreground mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="fighter@oco.gg"
              required
              className="bg-card border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-display text-muted-foreground mb-1">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-card border-border"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full font-display tracking-wider">
            {loading ? "..." : isLogin ? "Войти" : "Создать аккаунт"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-display"
          >
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>

        <div className="text-center">
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-primary">
            ← На главную
          </button>
        </div>
      </div>
    </div>
  );
}
