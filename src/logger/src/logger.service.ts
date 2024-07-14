import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
  private _logger: Console;
  private _customLogId: string;

  constructor(@Inject(REQUEST) private request: Request & { log: any }) {
    this._logger = console;
    this.logRequest();
  }

  debug(message: string, value?: any) {
    this.logMessage(message, 'DEBUG', value);
  }

  log(message: string, value?: any) {
    this.logMessage(message, 'INFO', value);
  }

  error(message: string, value?: any) {
    this.logMessage(message, 'ERROR', value);
  }

  warn(message: string, value?: any) {
    this.logMessage(message, 'WARN', value);
  }

  private logMessage(message: string, level: string, value?: any) {
    this._logger.log(level, message, value || '');
  }

  private logRequest() {
    const log = `${this.request.method} | ${
      this.request.url
    } | PARAMS: ${JSON.stringify(
      this.request.params,
    )} | QUERY: ${JSON.stringify(this.request.query)}`;
    this.log('request', log);
    this.logBody();
  }

  private logBody() {
    if (this.request.body) {
      this.log('BODY:', this.request.body);
    }
  }
}
