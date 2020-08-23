import { notifier } from '@beyonk/svelte-notifications'

function success(message, options) {
  notifier.success(message, options);
}

function error(message, options) {
  notifier.danger(message, options);
}

function warning(message, options) {
  notifier.warning(message, options);
}

function info(message, options) {
  notifier.info(message, options);
}

export default {
  success,
  error,
  warning,
  info,
}
