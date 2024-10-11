from django.urls import path

from openApiSystem.views.portrayal import (get, post, put, delete, file_post, file_put)

app_name = 'openApiSystem'
urlpatterns = [
    # '''
    # 객체 url
    # '''
    path('get/visual_item_list/', get.visual_item_list),
    path('get/symbol_list/', get.symbol_list),
    path('get/line_style_list/', get.line_style_list),
    path('get/area_fill_list/', get.area_fill_list),
    path('get/pixmap_list/', get.pixmap_list),
    path('get/item_schema_list/', get.item_schema_list),
    path('get/symbol_schema_list/', get.symbol_schema_list),
    path('get/line_style_schema_list/', get.line_style_schema_list),
    path('get/area_fill_schema_list/', get.area_fill_schema_list),
    path('get/pixmap_schema_list/', get.pixmap_schema_list),
    path('get/colour_profile_schema_list/', get.colour_profile_schema_list),
    path('get/colour_token_list/', get.colour_token_list),
    path('get/palette_item_list/', get.palette_item_list),
    path('get/colour_palette_list/', get.colour_palette_list),
    path('get/display_plane_list/', get.display_plane_list),
    path('get/display_mode_list/', get.display_mode_list),
    path('get/viewing_group_layer_list/', get.viewing_group_layer_list),
    path('get/viewing_group_list/', get.viewing_group_list),
    path('get/font_list/', get.font_list),
    path('get/context_parameter_list/', get.context_parameter_list),
    path('get/drawing_priority_list/', get.drawing_priority_list),
    path('get/alert_list/', get.alert_list),
    path('get/alert_highlight_list/', get.alert_highlight_list),
    path('get/alert_info_list/', get.alert_info_list),
    path('get/alert_message_list/', get.alert_message_list),

    path('get/symbol_detail/', get.symbol_detail),
    path('get/line_style_detail/', get.line_style_detail),
    path('get/area_fill_detail/', get.area_fill_detail),
    path('get/pixmap_detail/', get.pixmap_detail),
    path('get/item_schema_detail/', get.item_schema_detail),
    path('get/symbol_schema_detail/', get.symbol_schema_detail),
    path('get/line_style_schema_detail/', get.line_style_schema_detail),
    path('get/area_fill_schema_detail/', get.area_fill_schema_detail),
    path('get/pixmap_schema_detail/', get.pixmap_schema_detail),
    path('get/colour_profile_schema_detail/', get.colour_profile_schema_detail),
    path('get/colour_token_detail/', get.colour_token_detail),
    path('get/palette_item_detail/', get.palette_item_detail),
    path('get/colour_palette_detail/', get.colour_palette_detail),
    path('get/display_plane_detail/', get.display_plane_detail),
    path('get/display_mode_detail/', get.display_mode_detail),
    path('get/viewing_group_layer_detail/', get.viewing_group_layer_detail),
    path('get/viewing_group_detail/', get.viewing_group_detail),
    path('get/font_detail/', get.font_detail),
    path('get/context_parameter_detail/', get.context_parameter_detail),
    path('get/drawing_priority_detail/', get.drawing_priority_detail),
    path('get/alert_detail/', get.alert_detail),
    path('get/alert_highlight_detail/', get.alert_highlight_detail),
    path('get/alert_info_detail/', get.alert_info_detail),
    path('get/alert_message_detail/', get.alert_message_detail),
    

    # path('post/symbol/', post.insert_symbol_item),
    # path('post/line_style/', post.insert_line_style_item),
    # path('post/area_fill/', post.insert_area_fill_item),
    # path('post/pixmap/', post.insert_pixmap_item),

    # path('post/symbol_schema/', post.insert_symbol_schema),
    # path('post/line_style_schema/', post.insert_line_style_schema),
    # path('post/area_fill_schema/', post.insert_area_fill_schema),
    # path('post/pixmap_schema/', post.insert_pixmap_schema),
    # path('post/colour_profile_schema/', post.insert_colour_profile_schema),
    path('post/colour_token/', post.insert_colour_token),
    path('post/palette_item/', post.insert_palette_item),
    path('post/colour_palette/', post.insert_colour_palette),
    path('post/display_plane/', post.insert_display_plane),
    path('post/display_mode/', post.insert_display_mode),
    path('post/viewing_group_layer/', post.insert_viewing_group_layer),
    path('post/viewing_group/', post.insert_viewing_group),
    # path('post/font/', post.insert_font),
    path('post/context_parameter/', post.insert_context_parameter),
    path('post/drawing_priority/', post.insert_drawing_priority),
    path('post/alert/', post.insert_alert),
    path('post/alert_highlight/', post.insert_alert_highlight),
    path('post/alert_message/', post.insert_alert_message),

    # path('put/symbol/', put.symbol),
    # path('put/line_style/', put.line_style),
    # path('put/area_fill/', put.area_fill),
    # path('put/pixmap/', put.pixmap),

    # path('put/symbol_schema/', put.symbol_schema),
    # path('put/line_style_schema/', put.line_style_schema),
    # path('put/area_fill_schema/', put.area_fill_schema),
    # path('put/pixmap_schema/', put.pixmap_schema),
    # path('put/colour_profile_schema/', put.colour_profile_schema),
    path('put/colour_token/', put.colour_token),
    path('put/palette_item/', put.palette_item),
    path('put/colour_palette/', put.colour_palette),
    path('put/display_plane/', put.display_plane),
    path('put/display_mode/', put.display_mode),
    path('put/viewing_group_layer/', put.viewing_group_layer),
    path('put/viewing_group/', put.viewing_group),
    # path('put/font/', put.font),
    path('put/context_parameter/', put.context_parameter),
    path('put/drawing_priority/', put.drawing_priority),
    path('put/alert/', put.alert),
    path('put/alert_highlight/', put.alert_highlight),
    path('put/alert_message/', put.alert_message),


    path('delete/symbol/', delete.symbol),
    path('delete/line_style/', delete.line_style),
    path('delete/area_fill/', delete.area_fill),
    path('delete/pixmap/', delete.pixmap),
    path('delete/symbol_schema/', delete.symbol_schema),
    path('delete/line_style_schema/', delete.line_style_schema),
    path('delete/area_fill_schema/', delete.area_fill_schema),
    path('delete/pixmap_schema/', delete.pixmap_schema),
    path('delete/colour_profile_schema/', delete.colour_profile_schema),
    path('delete/colour_token/', delete.colour_token),
    path('delete/palette_item/', delete.palette_item),
    path('delete/colour_palette/', delete.colour_palette),
    path('delete/display_plane/', delete.display_plane),
    path('delete/display_mode/', delete.display_mode),
    path('delete/viewing_group_layer/', delete.viewing_group_layer),
    path('delete/viewing_group/', delete.viewing_group),
    path('delete/font/', delete.font),
    path('delete/context_parameter/', delete.context_parameter),
    path('delete/drawing_priority/', delete.drawing_priority),
    path('delete/alert/', delete.alert),
    path('delete/alert_highlight/', delete.alert_highlight),
    path('delete/alert_message/', delete.alert_message),


    ### 연관관계 url
    # path('get/symbol_association/', get.symbol_association),
    # path('get/item_schema_association/', get.item_schema_association),
    # path('get/colour_token_association/', get.colour_token_association),
    # path('get/palette_association/', get.palette_association),
    # path('get/display_mode_association/', get.display_mode_association),
    # path('get/viewing_group_association/', get.viewing_group_association),
    # path('get/highlight_association/', get.highlight_association),
    # path('get/icon_association/', get.icon_association),
    # path('get/value_association/', get.value_association),
    # path('get/msg_association/', get.msg_association),

    # path('post/symbol_association/', post.symbol_association),
    # path('post/item_schema_association/', post.item_schema_association),
    # path('post/colour_token_association/', post.colour_token_association),
    # path('post/palette_association/', post.palette_association),
    # path('post/display_mode_association/', post.display_mode_association),
    # path('post/viewing_group_association/', post.viewing_group_association),
    # path('post/highlight_association/', post.highlight_association),
    # path('post/icon_association/', post.icon_association),
    # path('post/value_association/', post.value_association),
    # path('post/msg_association/', post.msg_association),

    # path('delete/symbol_association/', delete.symbol_association),
    # path('delete/item_schema_association/', delete.item_schema_association),
    # path('delete/colour_token_association/', delete.colour_token_association),
    # path('delete/palette_association/', delete.palette_association),
    # path('delete/display_mode_association/', delete.display_mode_association),
    # path('delete/viewing_group_association/', delete.viewing_group_association),
    # path('delete/highlight_association/', delete.highlight_association),
    # path('delete/icon_association/', delete.icon_association),
    # path('delete/value_association/', delete.value_association),
    # path('delete/msg_association/', delete.msg_association),



    # '''
    # 파일 업로드 url
    # '''

    path('post/symbol/', file_post.insert_symbol_item),
    path('post/line_style/', file_post.insert_line_style_item),
    path('post/area_fill/', file_post.insert_area_fill_item),
    path('post/pixmap/', file_post.insert_pixmap_item),

    path('post/symbol_schema/', file_post.insert_symbol_schema),
    path('post/line_style_schema/', file_post.insert_line_style_schema),
    path('post/area_fill_schema/', file_post.insert_area_fill_schema),
    path('post/pixmap_schema/', file_post.insert_pixmap_schema),
    path('post/colour_profile_schema/', file_post.insert_colour_profile_schema),

    path('post/font/', file_post.insert_font),

    path('put/symbol/', file_put.symbol),
    path('put/line_style/', file_put.line_style),
    path('put/area_fill/', file_put.area_fill),
    path('put/pixmap/', file_put.pixmap),

    path('put/symbol_schema/', file_put.symbol_schema),
    path('put/line_style_schema/', file_put.line_style_schema),
    path('put/area_fill_schema/', file_put.area_fill_schema),
    path('put/pixmap_schema/', file_put.pixmap_schema),
    path('put/colour_profile_schema/', file_put.colour_profile_schema),
    
    path('put/font/', file_put.font),

]