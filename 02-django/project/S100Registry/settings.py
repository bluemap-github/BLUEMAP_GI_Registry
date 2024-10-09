"""
Django settings for S100Registry project.

Generated by 'django-admin startproject' using Django 4.2.10.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
from pathlib import Path
from decouple import config
import base64

# import KEY

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# 파일 저장 경로 설정
FILES_DIR = os.path.join(BASE_DIR, 'files')

# 개별 디렉토리 설정
PREVIEW_IMAGE_DIR = os.path.join(FILES_DIR, 'preview_image')
ENGINEERING_IMAGE_DIR = os.path.join(FILES_DIR, 'engineering_image')
XML_DIR = os.path.join(FILES_DIR, 'xml')
FONT_DIR = os.path.join(FILES_DIR, 'font')
SVG_DIR = os.path.join(FILES_DIR, 'svg')

# 디렉토리 생성 (필요 시 자동으로 생성)
os.makedirs(PREVIEW_IMAGE_DIR, exist_ok=True)
os.makedirs(ENGINEERING_IMAGE_DIR, exist_ok=True)
os.makedirs(XML_DIR, exist_ok=True)
os.makedirs(FONT_DIR, exist_ok=True)
os.makedirs(SVG_DIR, exist_ok=True)

# 파일을 저장할 기본 경로 설정
MEDIA_ROOT = FILES_DIR  # 'files' 폴더 안에 저장
MEDIA_URL = '/media/'   # 파일에 접근할 때 사용할 URL

# STATIC_ROOT = os.path.join(BASE_DIR, '_static') 
STATIC_ROOT = "/usr/src/app/_static/" 
STATIC_URL = '/static/'


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = config('DEBUG', default=False, cast=bool)
DEBUG = True


ALLOWED_HOSTS = ['bluemap.kr', 'localhost', '127.0.0.1']

# Application definition

INSTALLED_APPS = [
    'regiSystem',
    'userSystem',
    'openApiSystem',
    'drf_yasg', #drf_yasg
    'rest_framework',    # pip install djangorestframework
    'django_extensions', # pip install django-extensions
    'corsheaders',       # python -m pip install django-cors-headers

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.common.CommonMiddleware', 

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'S100Registry.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'S100Registry.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:8000",
    "http://bluemap.kr",
]

##CORS
CORS_ORIGIN_ALLOW_ALL=True # 모든 호스트 허용
CORS_ALLOW_CREDENTIALS = True # 쿠키가 cross-site HTTP 요청에 포함될 수 있다

CORS_ALLOW_METHODS = [  # 실제 요청에 허용되는 HTTP 동사 리스트
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [  # 실제 요청을 할 때 사용될 수 있는 non-standard HTTP 헤더 목록// 현재 기본값
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

APPEND_SLASH = False # / 관련 에러 제거

ENCRYPTION_KEY_BASE64 = config('ENCRYPTION_KEY')
ENCRYPTION_KEY = base64.b64decode(ENCRYPTION_KEY_BASE64)