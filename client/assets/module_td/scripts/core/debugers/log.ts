export function genTimeStamps() {
  return new Date().getTime();
}

export class Logger {
  static log(session: string, message: string) {
    const msg = `[${genTimeStamps()}] [${session}] ${message}`;
    console.log(msg);
  }

  static error(session: string, message: string) {
    const msg = `[${genTimeStamps()}] [${session}] ${message}`;
    console.error(msg);
  }

  static warn(session: string, message: string) {
    const msg = `[${genTimeStamps()}] [${session}] ${message}`;
    console.warn(msg);
  }
}
