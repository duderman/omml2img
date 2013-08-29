@REM ----------------------------------------------------------------------------
@REM Copyright 2001-2004 The Apache Software Foundation.
@REM
@REM Licensed under the Apache License, Version 2.0 (the "License");
@REM you may not use this file except in compliance with the License.
@REM You may obtain a copy of the License at
@REM
@REM      http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing, software
@REM distributed under the License is distributed on an "AS IS" BASIS,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM See the License for the specific language governing permissions and
@REM limitations under the License.
@REM ----------------------------------------------------------------------------
@REM

@echo off

set ERROR_CODE=0

:init
@REM Decide how to startup depending on the version of windows

@REM -- Win98ME
if NOT "%OS%"=="Windows_NT" goto Win9xArg

@REM set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" @setlocal

@REM -- 4NT shell
if "%eval[2+2]" == "4" goto 4NTArgs

@REM -- Regular WinNT shell
set CMD_LINE_ARGS=%*
goto WinNTGetScriptDir

@REM The 4NT Shell from jp software
:4NTArgs
set CMD_LINE_ARGS=%$
goto WinNTGetScriptDir

:Win9xArg
@REM Slurp the command line arguments.  This loop allows for an unlimited number
@REM of agruments (up to the command line limit, anyway).
set CMD_LINE_ARGS=
:Win9xApp
if %1a==a goto Win9xGetScriptDir
set CMD_LINE_ARGS=%CMD_LINE_ARGS% %1
shift
goto Win9xApp

:Win9xGetScriptDir
set SAVEDIR=%CD%
%0\
cd %0\..\.. 
set BASEDIR=%CD%
cd %SAVEDIR%
set SAVE_DIR=
goto repoSetup

:WinNTGetScriptDir
set BASEDIR=%~dp0\..

:repoSetup


if "%JAVACMD%"=="" set JAVACMD=java

if "%REPO%"=="" set REPO=%BASEDIR%\repo

set CLASSPATH="%BASEDIR%"\etc;"%REPO%"\jeuclid-core-3.1.9.jar;"%REPO%"\commons-logging-1.1.1.jar;"%REPO%"\batik-svg-dom-1.7.jar;"%REPO%"\batik-anim-1.7.jar;"%REPO%"\batik-awt-util-1.7.jar;"%REPO%"\batik-util-1.7.jar;"%REPO%"\batik-dom-1.7.jar;"%REPO%"\batik-css-1.7.jar;"%REPO%"\batik-ext-1.7.jar;"%REPO%"\xml-apis-1.3.04.jar;"%REPO%"\xml-apis-ext-1.3.04.jar;"%REPO%"\batik-xml-1.7.jar;"%REPO%"\batik-parser-1.7.jar;"%REPO%"\xmlgraphics-commons-1.3.1.jar;"%REPO%"\commons-io-1.3.1.jar;"%REPO%"\jeuclid-cli-3.1.9.jar;"%REPO%"\commons-cli-1.2.jar;"%REPO%"\commons-lang-2.4.jar;"%REPO%"\jeuclid-mathviewer-3.1.9.jar;"%REPO%"\AppleJavaExtensions-1.2.jar;"%REPO%"\dejavu-fonts-2.29.jar;"%REPO%"\stix-fonts-1.0-beta-2.jar;"%REPO%"\ams-fonts-1.0.jar;"%REPO%"\jeuclid-minimal-3.1.9.pom
set EXTRA_JVM_ARGUMENTS=
goto endInit

@REM Reaching here means variables are defined and arguments have been captured
:endInit

%JAVACMD% %JAVA_OPTS% %EXTRA_JVM_ARGUMENTS% -classpath %CLASSPATH_PREFIX%;%CLASSPATH% -Dapp.name="listfonts" -Dapp.repo="%REPO%" -Dbasedir="%BASEDIR%" net.sourceforge.jeuclid.app.ListFonts %CMD_LINE_ARGS%
if ERRORLEVEL 1 goto error
goto end

:error
if "%OS%"=="Windows_NT" @endlocal
set ERROR_CODE=1

:end
@REM set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" goto endNT

@REM For old DOS remove the set variables from ENV - we assume they were not set
@REM before we started - at least we don't leave any baggage around
set CMD_LINE_ARGS=
goto postExec

:endNT
@endlocal

:postExec

if "%FORCE_EXIT_ON_ERROR%" == "on" (
  if %ERROR_CODE% NEQ 0 exit %ERROR_CODE%
)

exit /B %ERROR_CODE%
