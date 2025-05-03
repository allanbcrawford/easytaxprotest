import json
import re

def clean_value(value):
    """Clean a value by removing tabs and multiple spaces"""
    # Replace tabs with spaces
    value = value.replace('\t', ' ')
    # Replace multiple spaces with a single space
    value = re.sub(r'\s+', ' ', value)
    # Strip leading/trailing spaces
    return value.strip()

def parse_line(line):
    """Parse a line using a combination of fixed width and field detection"""
    # Split fields based on both fixed positions and actual content
    fields = re.split(r'\s{2,}|\t+', line.strip())
    
    # Expected field names in order
    field_names = [
        'acct', 'yr', 'mailto', 'mail_addr_1', 'mail_addr_2', 'mail_city',
        'mail_state', 'mail_zip', 'mail_country', 'undeliverable', 'str_pfx',
        'str_num', 'str_num_sfx', 'str', 'str_sfx', 'str_sfx_dir', 'str_unit',
        'site_addr_1', 'site_addr_2', 'site_addr_3', 'state_class', 'school_dist',
        'map_facet', 'key_map', 'Neighborhood_Code', 'Neighborhood_Grp',
        'Market_Area_1', 'Market_Area_1_Dscr', 'Market_Area_2', 'Market_Area_2_Dscr',
        'econ_area', 'econ_bld_class', 'center_code', 'yr_impr', 'yr_annexed',
        'splt_dt', 'dsc_cd', 'nxt_bld', 'bld_ar', 'land_ar', 'acreage',
        'Cap_acct', 'shared_cad', 'land_val', 'bld_val', 'x_features_val',
        'ag_val', 'assessed_val', 'tot_appr_val', 'tot_mkt_val', 'prior_land_val',
        'prior_bld_val', 'prior_x_features_val', 'prior_ag_val',
        'prior_tot_appr_val', 'prior_tot_mkt_val', 'new_construction_val',
        'tot_rcn_val', 'value_status', 'noticed', 'notice_dt', 'protested',
        'certified_date', 'rev_dt', 'rev_by', 'new_own_dt', 'lgl_1', 'lgl_2',
        'lgl_3', 'lgl_4', 'jurs'
    ]
    
    result = {}
    
    # Initialize all fields with empty strings
    for field in field_names:
        result[field] = ''
    
    # Fill in the values we have
    for i, value in enumerate(fields):
        if i < len(field_names):
            clean_val = clean_value(value)
            field_name = field_names[i]
            
            # Convert numeric fields
            if field_name in ['land_val', 'bld_val', 'x_features_val', 'ag_val',
                            'assessed_val', 'tot_appr_val', 'tot_mkt_val',
                            'prior_land_val', 'prior_bld_val', 'prior_x_features_val',
                            'prior_ag_val', 'prior_tot_appr_val', 'prior_tot_mkt_val',
                            'new_construction_val', 'tot_rcn_val']:
                try:
                    result[field_name] = int(clean_val) if clean_val else 0
                except ValueError:
                    result[field_name] = 0
            else:
                result[field_name] = clean_val
    
    return result

def convert_to_json(input_file, output_file):
    records = []
    
    # Try different encodings
    encodings = ['latin1', 'cp1252', 'utf-8', 'utf-8-sig']
    
    for encoding in encodings:
        try:
            with open(input_file, 'r', encoding=encoding) as f:
                # Skip header line
                next(f)
                
                for line_num, line in enumerate(f, 2):
                    if line.strip():  # Skip empty lines
                        try:
                            record = parse_line(line)
                            records.append(record)
                        except Exception as e:
                            print(f"Error parsing line {line_num}: {e}")
                            continue
                
                # If we get here, the encoding worked
                break
        except UnicodeDecodeError:
            continue
        except Exception as e:
            print(f"Error with encoding {encoding}: {e}")
            continue
    
    if not records:
        print("Failed to read file with any encoding")
        return
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(records, f, indent=2)
        print(f"Successfully converted {len(records)} records to JSON")
    except Exception as e:
        print(f"Error writing JSON file: {e}")

if __name__ == '__main__':
    input_file = 'real_acct.txt'  # Updated path
    output_file = 'real_acct.json'  # Updated path
    convert_to_json(input_file, output_file) 