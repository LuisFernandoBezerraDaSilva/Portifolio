const prisma = require('../prisma/prisma');
const schedule = require('node-schedule');
const { sendNotification } = require('./fcmService');

const scheduledJobs = new Map();

function schedulingService(task, fcmToken) {
  let date = new Date(task.date);

  date.setHours(date.getHours() + 3);

  if (scheduledJobs.has(task.id)) {
    scheduledJobs.get(task.id).cancel();
    scheduledJobs.delete(task.id);
  }
  const job = schedule.scheduleJob(date, () => {
    sendNotification(fcmToken, {
      title: "Lembrete de tarefa",
      body: `Tarefa: ${task.title}\n${task.description}`,
    });
    scheduledJobs.delete(task.id);
  });
  scheduledJobs.set(task.id, job);
}

function cancelScheduledTask(id) {
  const scheduled = scheduledJobs.get(id);
  if (scheduled && typeof scheduled.cancel === "function") {
    scheduled.cancel();
    scheduledJobs.delete(id);
  }
}

async function scheduleUserTasks(userId, fcmToken) {
  const now = new Date();
  const tasks = await prisma.task.findMany({
    where: {
      userId: userId,
      date: { gt: now.toISOString().slice(0, 16) },
    },
  });
  tasks.forEach(task => schedulingService(task, fcmToken));
}

module.exports = { schedulingService, cancelScheduledTask, scheduleUserTasks };