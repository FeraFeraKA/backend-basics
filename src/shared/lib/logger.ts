type LogLevel = "info" | "warn" | "error";

type LogPayload = {
  message?: string;
  [key: string]: unknown;
};

function log(level: LogLevel, payload: LogPayload) {
  const entry = {
    level,
    time: new Date().toISOString(),
    ...payload,
  };

  if (level === "error") console.error(JSON.stringify(entry));
  else if (level === "warn") console.warn(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

export const logger = {
  error(payload: LogPayload) {
    log("error", payload);
  },
  
  warn(payload: LogPayload) {
    log("warn", payload);
  },

  info(payload: LogPayload) {
    log("info", payload);
  },
};
