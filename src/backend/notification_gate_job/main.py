import asyncio
import datetime
import logging
import json
from datetime import datetime

from aiokafka import AIOKafkaConsumer
from aiosmtplib import SMTPConnectError
from async_sender import Mail

from api.model.notification_service_models import KafkaNotificationModel
from settings import LOGLEVEL, KAFKA_NOTIFICATIONS_TOPIC, KAFKA_BOOTSTRAP_SERVERS, MAIL_HOSTNAME, MAIL_USERNAME, \
    MAIL_PASSWORD, MAIL_FROM_ADDRESS


def write_to_audit_log() -> None:
    """
    Write to DB audit table status "message has been sent" and send details
    :return:
    """
    # TODO
    pass


async def consume_notification():
    notifications_consumer = AIOKafkaConsumer(KAFKA_NOTIFICATIONS_TOPIC,
                                              bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS)

    mail = Mail(hostname=MAIL_HOSTNAME,
                username=MAIL_USERNAME,
                password=MAIL_PASSWORD,
                from_address=MAIL_FROM_ADDRESS,
                use_tls=True)

    await notifications_consumer.start()

    try:
        async for msg in notifications_consumer:

            mail_msg_json = json.loads(msg.value.decode())
            mail_msg = KafkaNotificationModel.parse_raw(mail_msg_json)

            logging.info(f"Notification for {mail_msg.to} consumed, channel: {mail_msg.channel_types}")

            for ch in mail_msg.channel_types:
                if ch == "EMAIL":
                    try:
                        await mail.send_message(mail_msg.subject, to=mail_msg.to, body=mail_msg.body)
                        write_to_audit_log()
                    except SMTPConnectError as ex:
                        logging.error(f"Error: {ex}")
                else:
                    # TODO
                    logging.error(f"Unknown channel type {ch}, skipped")

    except Exception as ex:
        logging.error(f"Error: {ex}")
        await notifications_consumer.stop()
        raise ex
    finally:
        await notifications_consumer.stop()


async def main():
    kafka_task = asyncio.create_task(consume_notification())

    logging.info(f"Started at {datetime.now()}")

    await kafka_task


if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s %(levelname)s (%(threadName)s)[%(filename)s:%(funcName)s:%(lineno)d] %(message)s',
        level=logging.getLevelName(LOGLEVEL))

    asyncio.run(main())
