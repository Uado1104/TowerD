export function genTimeStamps() {
  return new Date().getTime();
}

export class Logger {
  static log(session: string, message: string) {
    console.log(`[${genTimeStamps()}] [${session}] ${message}`);
  }

  static error(session: string, message: string) {
    console.error(`[${genTimeStamps()}] [${session}] ${message}`);
  }

  static warn(session: string, message: string) {
    console.warn(`[${genTimeStamps()}] [${session}] ${message}`);
  }
}