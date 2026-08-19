from telethon import TelegramClient, events
import winsound
import asyncio

# Tus datos (Ya están correctos)
api_id = 38941393
api_hash = '1fb9a9f22a76fd27b5533caf2011f627'
id_canal = -1002393940741

client = TelegramClient('detector', api_id, api_hash)

@client.on(events.NewMessage(chats=id_canal))
async def my_event_handler(event):
    # Imprime el mensaje para que veas qué llegó
    print(f"¡NUEVA APUESTA EN TONY PICKS!: {event.raw_text[:100]}...")
    
    # Sonido de alerta (Frecuencia 1500Hz, Duración 1000ms)
    winsound.Beep(1000, 2500)

async def iniciar():
    # Iniciamos el cliente
    await client.start()
    
    # Verificamos que el canal sea accesible para tu cuenta
    try:
        entidad = await client.get_entity(id_canal)
        print(f"✅ Conectado exitosamente a: {entidad.title}")
    except Exception as e:
        print(f"❌ Error al encontrar el canal: {e}")
        return

    print("🚀 Escuchando mensajes... No cierres esta ventana.")
    await client.run_until_disconnected()

# Arrancamos el script correctamente
if __name__ == '__main__':
    asyncio.run(iniciar())