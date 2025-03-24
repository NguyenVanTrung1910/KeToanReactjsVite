import SubHeader, {
    SubHeaderLeft,
    SubHeaderRight,
    SubheaderSeparator,
} from '../../layout/SubHeader/SubHeader';
import Button, { ButtonGroup } from '../../components/bootstrap/Button';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { ReactNode } from 'react';
interface SubProps {
    title1: string;
    title2: string;
    link1: string;
    link2: string;
    listButton?: ReactNode;
}
const SubHeaderDM: React.FC<SubProps> = ({ title1, title2, link2, link1,listButton }) => {
    return (
        <SubHeader>
            <SubHeaderLeft>
                <Breadcrumb
                    list={[
                        {
                            title: title1,
                            to: link1,
                        },
                        {
                            title: title2,
                            to: link2,
                        },
                    ]}
                />
            </SubHeaderLeft>
            <SubHeaderRight>
                {listButton}
                <Button className='btn btn-outline-info border-transparent btn-hover-shadow-lg shadow-none'>Xuất Excel</Button>
            </SubHeaderRight>
        </SubHeader>
    )
}
export default SubHeaderDM