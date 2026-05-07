import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useStore } from "@/store/useStore";
import type { AuthResponse, Build, OptimizationResult, CurrencyCode, PerformanceTier } from "@/types";

// ─── Auth Hooks ───────────────────────────────────────────────────────────────

export function useLogin() {
  const setAuth = useStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post<AuthResponse>("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

export function useRegister() {
  const setAuth = useStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const res = await api.post<AuthResponse>("/auth/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

export function useCurrentUser() {
  const token = useStore((s) => s.token);
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data.user;
    },
    enabled: !!token,
    retry: false,
  });
}

// ─── ML Optimization Hook ────────────────────────────────────────────────────

export function useOptimize() {
  const setCurrentBuild = useStore((s) => s.setCurrentBuild);
  return useMutation({
    mutationFn: async (data: { budget: number; tier: PerformanceTier; currency: CurrencyCode }) => {
      const res = await api.post<OptimizationResult>("/ml/optimize", data);
      return res.data;
    },
    onSuccess: (data) => {
      setCurrentBuild(data);
    },
  });
}

// ─── Builds CRUD Hooks ───────────────────────────────────────────────────────

export function useBuilds() {
  const token = useStore((s) => s.token);
  return useQuery({
    queryKey: ["builds"],
    queryFn: async () => {
      const res = await api.get<Build[]>("/builds");
      return res.data;
    },
    enabled: !!token,
  });
}

export function useSaveBuild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Build>) => {
      const res = await api.post<Build>("/builds", data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["builds"] });
    },
  });
}

export function useDeleteBuild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/builds/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["builds"] });
    },
  });
}
