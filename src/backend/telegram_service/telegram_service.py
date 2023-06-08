import logging
from enum import Enum

import requests
from email_validator import validate_email
from telegram import Update, Chat
from telegram.ext import Application, MessageHandler, filters, ContextTypes, CommandHandler

from api.model.user_service_models import UserModel
from settings import TELEGRAM_BOT_TOKEN, INTERNAL_USER_SERVICE

logger = logging.getLogger(__name__)


class State(Enum):
    NOT_REGISTERED = 'NOT_REGISTERED'
    START_REGISTRATION = 'START_REGISTRATION'
    REGISTERED = 'REGISTERED'
    SEND_CONFIRM_CODE = 'SEND_CONFIRM_CODE'


async def __get_registered(email: str) -> UserModel | None:
    try:
        response = requests.get(INTERNAL_USER_SERVICE + "/private/users/email/" + email)
        if response.status_code == 200:
            json = response.json()
            if json is None:
                return None
            return UserModel.parse_raw(json)
        else:
            logging.error("htone-users.ERROR : {}".format(response.text))
    except Exception as e:
        logging.error("htone-users.ERROR : {}".format(e))
    return None


async def __help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Help!")


async def __info_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    state = context.chat_data.get("registration", dict())["state"]
    await update.message.reply_text("[STATE]: {}".format(state))


async def __private_chat(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_name = update.effective_user.full_name
    chat = update.effective_chat
    if chat.type != Chat.PRIVATE:
        await update.effective_message.reply_text(
            f"Здравствуйте {user_name}. Бот работает только в личном чате."
        )
        return

    d = context.chat_data.setdefault("registration", dict())
    if "state" not in d:
        logger.info("Отправляем запрос для получения информации о ранее регистрированном пользователе {}"
                    .format(update.effective_user.id))
        d["state"] = State.NOT_REGISTERED

    message = update.message.text
    if State.START_REGISTRATION == d["state"]:
        try:
            email_info = validate_email(message, check_deliverability=False)
            email = email_info.normalized
            user_model = await __get_registered(email)
            if user_model is None:
                await update.message.reply_text("Вы не зарегистрированы в системе \"Агрегатор площадок и услуг "
                                                "креативных индустрий Москвы\"")
                d["state"] = State.NOT_REGISTERED
                return
            telegram_id = user_model.telegram
            if telegram_id is not None:
                await update.message.reply_text("Вы уже зарегистрированы ранее")
                d["state"] = State.REGISTERED
                return
            logger.info("Send code to {}".format(email))
            await update.message.reply_text("На вашу электронную почту отправлен код проверки")
            d["state"] = State.SEND_CONFIRM_CODE
            d["confirm_code"] = "1010"
            return
        except Exception as e:
            logger.exception("", e)
            d["state"] = State.NOT_REGISTERED
    elif State.REGISTERED == d["state"]:
        logger.info("[REGISTERED] {}".format(update.message))
        return
    elif State.SEND_CONFIRM_CODE == d["state"]:
        logger.info("[SEND_CONFIRM_CODE] {}".format(update.message))
        if message is not None and message == d["confirm_code"]:
            await update.message.reply_text("Код принят, вы зарегистрированы")
            logger.info("[SEND_CONFIRM_CODE] {}".format(update.message))
            d["state"] = State.REGISTERED
        else:
            d["state"] = State.NOT_REGISTERED
        d["confirm_code"] = None
        return
    elif State.NOT_REGISTERED == d["state"]:
        if "/registration" == message:
            d["state"] = State.START_REGISTRATION
            await update.message.reply_text("Вам необходимо прислать адрес электронной почты")
            return
        await update.effective_message.reply_text(
            f"Здравствуйте {user_name}. Вам необходимо зарегистрироваться. Выполните команду /registration."
        )
        return
    else:
        await update.message.reply_text("Сообщения принимаются только для зарегистрированных пользователей")
    return


def dispatcher():
    logging.getLogger("httpx").setLevel("WARN")
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    application.add_handler(CommandHandler("help", __help_command))
    application.add_handler(CommandHandler("info", __info_command))
    application.add_handler(MessageHandler(filters.ALL, __private_chat))
    application.run_polling(allowed_updates=Update.ALL_TYPES)
