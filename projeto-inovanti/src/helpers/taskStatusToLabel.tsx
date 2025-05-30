import { TaskStatus } from "../enums/taskStatus";

export function taskStatusToLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    [TaskStatus.CONCLUIDO]: "Concluído",
    [TaskStatus.EM_ANDAMENTO]: "Em andamento",
    [TaskStatus.A_FAZER]: "A fazer",
  };
  return map[status] || status;
}