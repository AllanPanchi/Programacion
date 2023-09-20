from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

driver_path = "D:\\Allan"

opciones = webdriver.ChromeOptions()
opciones.binary_location = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"

driver = webdriver.Chrome(executable_path=driver_path, options=opciones)

driver.get("https://web.whatsapp.com/")

time.sleep(15)

contacto = "Lo que sea xd"  # Reemplaza con el nombre del contacto que deseas enviar el mensaje
mensaje = "Hola, este es un mensaje enviado desde Selenium en Brave."
input("Escanea el código QR de WhatsApp Web y presiona Enter para continuar...")
driver.find_element_by_css_selector(f"span[title='{contacto}']").click()
input_box = driver.find_element_by_css_selector('div[contenteditable="true"]')
input_box.send_keys(mensaje)
input_box.send_keys(Keys.ENTER)

time.sleep(5)

driver.quit()


