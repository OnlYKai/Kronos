const FileOutputStream = Java.type("java.io.FileOutputStream")
const File = Java.type("java.io.File")
const Channels = Java.type("java.nio.channels.Channels")
const Long = Java.type("java.lang.Long")

export default function downloadFile(url, destination) {
    destination = new File(destination)
    destination.getParentFile().mkdirs()
    connection = com.chattriggers.ctjs.CTJS.INSTANCE.makeWebRequest(url)

    const is = connection.getInputStream()
    rbc = Channels.newChannel(is)
    fos = new FileOutputStream(destination)
    fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE)
    fos.close()
    is.close()
}