import logging

from telegram import Update, Chat
from telegram.ext import Application, MessageHandler, filters, ContextTypes

from settings import TELEGRAM_BOT_TOKEN

logger = logging.getLogger(__name__)


async def __private_chat(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_name = update.effective_user.full_name
    chat = update.effective_chat
    if chat.type != Chat.PRIVATE or chat.id in context.bot_data.get("user_ids", set()):
        logger.info("Message: {}".format(update))
        return
    logger.info("%s started a private chat with the bot", user_name)
    context.bot_data.setdefault("user_ids", set()).add(chat.id)
    await update.effective_message.reply_text(
        f"Здравствуйте {user_name}. Вам необходимо выполнить команду /registration."
    )


def dispatcher():
    logging.getLogger("httpx").setLevel("WARN")
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    application.add_handler(MessageHandler(filters.ALL, __private_chat))
    application.run_polling(allowed_updates=Update.ALL_TYPES)
