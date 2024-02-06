import datetime

def enumValid(enum, find):
    for constant in enum:
        if constant.value == find:
            return constant
    raise ValueError("no value")


def dateValid(value):
    if not isinstance(value, datetime.date): 
        raise ValueError("datetime Error")
    return value