import subprocess


def execute_command(command, sudo=None):
    try:
        command = "chroot /host /bin/bash -c \"%s\"" % command
        print("Executing command")
        if "sudo" in command:
            command = command.replace("sudo", "echo %s | sudo -S" % sudo)

        return subprocess.check_output([command], shell=True)
    except subprocess.CalledProcessError as e:
        print("Error executing command: %s. %s" % (command, e))
        return e.output
    except Exception as e:
        print("Error executing command: %s. %s" % (command, e))
        return e
