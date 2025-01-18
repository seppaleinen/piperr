import socket
import subprocess


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # doesn't even have to be reachable
        s.connect(('10.254.254.254', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


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

class Agent:
    def __init__(self, agent_id, main, nickname, ip, os, shell, username, sudo_password=None):
        self.agent_id = agent_id
        self.sudo_password = sudo_password
        self.main = main
        self.nickname = nickname
        self.ip = ip if ip else get_ip()
        self.os = os if os else execute_command("whoami").strip().decode("utf-8")
        self.shell = shell if shell else execute_command("echo $SHELL").strip().decode("utf-8")
        self.username = username if username else execute_command("uname -o").strip().decode("utf-8")

    @staticmethod
    def create(agent_id, main, nickname, ip, os, shell, username, sudo_password=None):
        return Agent(agent_id,
                     main,
                     nickname,
                     ip,
                     os,
                     shell,
                     username,
                     sudo_password)

    @staticmethod
    def create_from_row(row):
        return Agent(row.get('id'),
                     row.get('main', False),
                     row.get('nickname', ''),
                     row.get('ip'),
                     row.get('os'),
                     row.get('shell'),
                     row.get('username'),
                     row.get('sudo_password'))

    def to_dict(self):
        return {
            'id': self.agent_id,
            'main': self.main,
            'nickname': self.nickname,
            'ip': self.ip,
            'os': self.os,
            'shell': self.shell,
            'username': self.username
        }