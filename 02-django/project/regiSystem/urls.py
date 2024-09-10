from django.urls import path

from .views import (RE, CD, SEARCH, PR)

app_name = 'regiSystem'
urlpatterns = [
    # CR
    # Register
    path('concept_register_list/get/', RE.get.concept_register_list),  
    path('concept_register/get/', RE.get.concept_register_detail),  
    path('concept_register/post/', RE.post.concept_register), 
    path('concept_register/put/<str:C_id>/', RE.put.concept_register),  
    path('concept_register/delete/<str:C_id>/', RE.delete.concept_register),  

    # RegisterItem
    path('concept_item/item/post/', CD.post.concept_item),
    path('concept_item_list/get/', RE.get.concept_item_list), 
    path('concept_item_one/get/', RE.get.concept_item_one), 
    path('concept_item/delete/', RE.delete.concept_item), 
    path('concept_item/put/', RE.put.concept_item),

    # ManagementInfo
    path('concept_item/mamagement_info/get/', RE.get.concept_managemant_info), 
    path('concept_item/mamagement_info/post/', RE.post.mamagement_info), 
    path('concept_item/mamagement_info/put/', RE.put.concept_managemant_info), 
    path('concept_item/mamagement_info/delete/', RE.delete.concept_managemant_info), 

    # ReferenceSource
    path('concept_item/reference_source/get/', RE.get.concept_reference_source), 
    path('concept_item/reference_source/post/', RE.post.reference_source), 
    path('concept_item/reference_source/put/', RE.put.concept_reference_source), 
    path('concept_item/reference_source/delete/', RE.delete.concept_reference_source), 

    # Reference
    path('concept_item/reference/get/', RE.get.concept_reference), 
    path('concept_item/reference/post/', RE.post.reference), 
    path('concept_item/reference/put/', RE.put.concept_reference), 
    path('concept_item/reference/delete/', RE.delete.concept_reference), 

    # DDR
    path('ddr_item_list/get/', CD.get.ddr_item_list),
    path('ddr_item_one/get/', CD.get.ddr_item_one),

    # EnumeratedValue
    path('enumerated_value/post/', CD.post.enumerated_value), 

    # SimpleAttrbute
    path('simple_attribute/post/', CD.post.simple_attribute), 

    # AttributeConstraints
    path('attribute_constraints/post/', CD.post.attribute_constraints),
    path('attribute_constraints/get/', CD.get.attribute_constraints),
    
    # ComplexAttribute 
    path('complex_attribute/post/', CD.post.complex_attribute), 

    # Feature
    path('feature/post/', CD.post.feature), 

    # Information
    path('information/post/', CD.post.information), 

    # RelatedValue
    path('related_item/search/', SEARCH.search.related_item),
    # path('browsing_registries/get/', SEARCH.search.browsing_registries),



    # Portrayal > Visual Item
    path('portrayal_item/symbol/post/', PR.post.insert_symbol_item),
    path('portrayal_item/line_style/post/', PR.post.insert_line_style_item),
    path('portrayal_item/area_fill/post/', PR.post.insert_area_fill_item),
    path('portrayal_item/pixmap/post/', PR.post.insert_pixmap_item),

    path('portrayal_item/symbol_list/get/', PR.get.get_symbol_list),
    path('portrayal_item/symbol/get/', PR.get.get_symbol),

    path('portrayal_item/line_style_list/get/', PR.get.get_line_style_list),
    path('portrayal_item/line_style/get/', PR.get.get_line_style),

    path('portrayal_item/area_fill_list/get/', PR.get.get_area_fill_list),
    path('portrayal_item/area_fill/get/', PR.get.get_area_fill),

    path('portrayal_item/pixmap_list/get/', PR.get.get_pixmap_list),
    path('portrayal_item/pixmap/get/', PR.get.get_pixmap),


    # Portrayal > Item Schema
    path('portrayal_item/symbol_schema/post/', PR.post.insert_symbol_schema),
    path('portrayal_item/line_style_schema/post/', PR.post.insert_line_style_schema),
    path('portrayal_item/area_fill_schema/post/', PR.post.insert_area_fill_schema),
    path('portrayal_item/pixmap_schema/post/', PR.post.insert_pixmap_schema),
    path('portrayal_item/colour_profile_schema/post/', PR.post.insert_colour_profile_schema),

    path('portrayal_item/symbol_schema_list/get/', PR.get.get_symbol_schema_list),
    path('portrayal_item/symbol_schema/get/', PR.get.get_symbol_schema),

    path('portrayal_item/line_style_schema_list/get/', PR.get.get_line_style_schema_list),
    path('portrayal_item/line_style_schema/get/', PR.get.get_line_style_schema),

    path('portrayal_item/area_fill_schema_list/get/', PR.get.get_area_fill_schema_list),
    path('portrayal_item/area_fill_schema/get/', PR.get.get_area_fill_schema),

    path('portrayal_item/pixmap_schema_list/get/', PR.get.get_pixmap_schema_list),
    path('portrayal_item/pixmap_schema/get/', PR.get.get_pixmap_schema),

    path('portrayal_item/colour_profile_schema_list/get/', PR.get.get_colour_profile_schema_list),
    path('portrayal_item/colour_profile_schema/get/', PR.get.get_colour_profile_schema),




    # Portrayal > Colour Token
    path('portrayal_item/colour_token/post/', PR.post.insert_colour_token),
    path('portrayal_item/colour_token_list/get/', PR.get.get_colour_token_list),
    path('portrayal_item/colour_token/get/', PR.get.get_colour_token),

    # Portrayal > Palette Item
    path('portrayal_item/palette_item/post/', PR.post.insert_palette_item),
    path('portrayal_item/palette_item_list/get/', PR.get.palette_item_list),
    path('portrayal_item/palette_item/get/', PR.get.palette_item),

    # Portrayal > Colour Palette
    path('portrayal_item/colour_palette/post/', PR.post.insert_colour_palette),
    path('portrayal_item/colour_palette_list/get/', PR.get.colour_palette_list),
    path('portrayal_item/colour_palette/get/', PR.get.colour_palette),

    # Portrayal > Display Plane
    path('portrayal_item/display_plane/post/', PR.post.insert_display_plane),
    path('portrayal_item/display_plane_list/get/', PR.get.display_plane_list),
    path('portrayal_item/display_plane/get/', PR.get.display_plane),
    # Portrayal > Display Mode
    path('portrayal_item/display_mode/post/', PR.post.insert_display_mode),
    path('portrayal_item/display_mode_list/get/', PR.get.display_mode_list),
    path('portrayal_item/display_mode/get/', PR.get.display_mode),
    # Portrayal > Viewing Group Layer
    path('portrayal_item/viewing_group_layer/post/', PR.post.insert_viewing_group_layer),
    path('portrayal_item/viewing_group_layer_list/get/', PR.get.viewing_group_layer_list),
    path('portrayal_item/viewing_group_layer/get/', PR.get.viewing_group_layer),
    # Portrayal > Viewing Group
    path('portrayal_item/viewing_group/post/', PR.post.insert_viewing_group),
    path('portrayal_item/viewing_group_list/get/', PR.get.viewing_group_list),
    path('portrayal_item/viewing_group/get/', PR.get.viewing_group),
    # Portrayal > Font
    path('portrayal_item/font/post/', PR.post.insert_font),
    path('portrayal_item/font_list/get/', PR.get.font_list),
    path('portrayal_item/font/get/', PR.get.font),
    # Portrayal > Context Parameter
    path('portrayal_item/context_parameter/post/', PR.post.insert_context_parameter),
    path('portrayal_item/context_parameter_list/get/', PR.get.context_parameter_list),
    path('portrayal_item/context_parameter/get/', PR.get.context_parameter),
    # Portrayal > Drawing Priority
    path('portrayal_item/drawing_priority/post/', PR.post.insert_drawing_priority),
    path('portrayal_item/drawing_priority_list/get/', PR.get.drawing_priority_list),
    path('portrayal_item/drawing_priority/get/', PR.get.drawing_priority),
    # Portrayal > Alert Highlight
    path('portrayal_item/alert_highlight/post/', PR.post.insert_alert_highlight),
    path('portrayal_item/alert_highlight_list/get/', PR.get.alert_highlight_list),
    path('portrayal_item/alert_highlight/get/', PR.get.alert_highlight),

    # Portrayal > Alert
    path('portrayal_item/alert/post/', PR.post.insert_alert),
    path('portrayal_item/alert_list/get/', PR.get.alert_list),
    path('portrayal_item/alert/get/', PR.get.alert),
    # Portrayal > Alert Message
    path('portrayal_item/alert_message/post/', PR.post.insert_alert_message),
    path('portrayal_item/alert_message_list/get/', PR.get.alert_message_list),
    path('portrayal_item/alert_message/get/', PR.get.alert_message),

]

