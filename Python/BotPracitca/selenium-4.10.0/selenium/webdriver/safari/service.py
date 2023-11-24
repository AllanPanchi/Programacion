# Licensed to the Software Freedom Conservancy (SFC) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The SFC licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

import os
import subprocess
import typing

from selenium.webdriver.common import service

DEFAULT_EXECUTABLE_PATH: str = "/usr/bin/safaridriver"


class Service(service.Service):
    """A Service class that is responsible for the starting and stopping of
    `safaridriver`  This is only supported on MAC OSX.

    :param executable_path: install path of the safaridriver executable, defaults to `/usr/bin/safaridriver`.
    :param port: Port for the service to run on, defaults to 0 where the operating system will decide.
    :param quiet: Suppress driver stdout & stderr, redirects to os.devnull if enabled.
    :param service_args: (Optional) List of args to be passed to the subprocess when launching the executable.
    :param env: (Optional) Mapping of environment variables for the new process, defaults to `os.environ`.
    """

    def __init__(
        self,
        executable_path: str = DEFAULT_EXECUTABLE_PATH,
        port: int = 0,
        quiet: bool = False,
        service_args: typing.Optional[typing.List[str]] = None,
        env: typing.Optional[typing.Mapping[str, str]] = None,
        reuse_service=False,
        **kwargs,
    ) -> None:
        self._check_executable(executable_path)
        self.service_args = service_args or []
        self.quiet = quiet
        self._reuse_service = reuse_service
        log_file = subprocess.PIPE if not self.quiet else open(os.devnull, "w", encoding="utf-8")
        super().__init__(
            executable=executable_path,
            port=port,
            log_file=log_file,  # type: ignore
            env=env,
            **kwargs,
        )

    @staticmethod
    def _check_executable(executable_path) -> None:
        if not os.path.exists(executable_path):
            if "Safari Technology Preview" in executable_path:
                message = "Safari Technology Preview does not seem to be installed. You can download it at https://developer.apple.com/safari/download/."
            else:
                message = "SafariDriver was not found; are you running Safari 10 or later? You can download Safari at https://developer.apple.com/safari/download/."
            raise Exception(message)

    def command_line_args(self) -> typing.List[str]:
        return ["-p", f"{self.port}"] + self.service_args

    @property
    def service_url(self) -> str:
        """Gets the url of the SafariDriver Service."""
        return f"http://localhost:{self.port}"

    @property
    def reuse_service(self) -> bool:
        return self._reuse_service

    @reuse_service.setter
    def reuse_service(self, reuse: bool) -> None:
        self._reuse_service = reuse